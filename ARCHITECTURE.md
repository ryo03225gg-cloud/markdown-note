# ARCHITECTURE.md - 技術設計

## 技術スタック

| 項目 | 採用 |
|------|------|
| 言語 | JavaScript（JSX） |
| フレームワーク | React 19 + Vite |
| マークダウン変換 | marked |
| スタイル | CSS（各コンポーネントに対応するCSSファイル） |
| データ保存 | localStorage |
| ホスティング | Cloudflare Pages |

---

## ディレクトリ構成

```
src/
├── components/
│   ├── Sidebar.jsx         # ノート一覧 + 新規作成ボタン
│   ├── Sidebar.css
│   ├── NoteItem.jsx        # サイドバー内のノート1件
│   ├── NoteItem.css
│   ├── EditorArea.jsx      # タイトル欄 + 左右ペイン（エディタ + プレビュー）
│   ├── EditorArea.css
│   ├── MobileTabBar.jsx    # スマホ用「編集」「プレビュー」タブ
│   └── MobileTabBar.css
├── hooks/
│   └── useNotes.js         # ノートの操作ロジックと localStorage 管理
├── utils/
│   └── markdown.js         # marked のラッパー（XSS対策込み）
├── App.jsx
├── App.css
└── main.jsx
```

---

## コンポーネント設計

### コンポーネントツリー

```
App
├── Sidebar
│   └── NoteItem（ノートの数だけ繰り返し）
├── MobileTabBar（スマホ時のみ表示）
└── EditorArea
    ├── タイトル入力欄（EditorArea内に含む）
    ├── textarea（エディタ）
    └── プレビュー領域
```

### 各コンポーネントの責務

| コンポーネント | 役割 |
|---------------|------|
| **App** | 全体のレイアウト制御。状態を持ち、子コンポーネントに配布する |
| **Sidebar** | ノート一覧の表示と「+ 新規ノート」ボタン |
| **NoteItem** | 1件のノート行（タイトル表示 + 削除ボタン） |
| **MobileTabBar** | スマホ用の「編集 / プレビュー」タブ切り替えUI |
| **EditorArea** | タイトル入力 + エディタ(textarea) + プレビューを1つにまとめたペイン |

---

## 状態（State）設計

App.jsx が全ての状態を持つ。

```
notes:         Note[]   全ノートの配列
activeNoteId:  string   現在選択中のノートのID
mobileTab:     string   スマホ用タブ（'edit' | 'preview'）
```

**派生データ（Derived State）**:
```
activeNote = notes.find(n => n.id === activeNoteId)
→ 状態ではなく、毎回計算する。二重管理しない。
```

---

## カスタムフック（useNotes）

```
useNotes() が返すもの：

notes            ノートの配列
activeNoteId     選択中ノートのID
activeNote       選択中ノートのオブジェクト（派生）
createNote()     新規ノートを作成して選択状態にする
updateNote()     選択中ノートのタイトル or 本文を更新
deleteNote(id)   指定IDのノートを削除
selectNote(id)   選択ノートを切り替える
```

---

## データ構造（localStorage）

キー名: `markdown-note-data`

```json
{
  "notes": [
    {
      "id": "1708123456789",
      "title": "マークダウンの使い方",
      "content": "# 見出し\n\n**太字**\n\n- 箇条書き",
      "updatedAt": "2026-02-20T00:00:00.000Z"
    }
  ],
  "activeNoteId": "1708123456789"
}
```

| フィールド | 型 | 説明 |
|------------|-----|------|
| id | string | `Date.now().toString()` で生成するユニークID |
| title | string | ノートタイトル（空の場合は「無題」として扱う） |
| content | string | マークダウン本文 |
| updatedAt | string | 最終更新日時（ISO 8601） |

---

## Props の流れ

```
App
 ├─ notes, activeNoteId（状態）
 │
 ├─→ Sidebar
 │     notes, activeNoteId
 │     onSelect: (id) => selectNote(id)
 │     onCreate: () => createNote()
 │     └─→ NoteItem
 │             note, isActive
 │             onSelect, onDelete: (id) => deleteNote(id)
 │
 ├─→ MobileTabBar（スマホのみ）
 │     mobileTab, onTabChange
 │
 └─→ EditorArea
       activeNote
       mobileTab
       onTitleChange: (val) => updateNote({ title: val })
       onContentChange: (val) => updateNote({ content: val })
```

---

## markdown.js の役割

`marked` をそのまま使うと XSS（悪意あるコードの埋め込み）のリスクがある。  
`markdown.js` でサニタイズ（危険なコードの除去）の設定を一元管理する。

```javascript
// utils/markdown.js
import { marked } from 'marked';
marked.setOptions({ breaks: true });
export function renderMarkdown(content) {
  return marked.parse(content ?? '');
}
```
