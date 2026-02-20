import { renderMarkdown } from '../utils/markdown';
import './EditorArea.css';

export default function EditorArea({ activeNote, mobileTab, onTitleChange, onContentChange }) {
  if (!activeNote) {
    return (
      <div className="editor-area editor-area--empty">
        <p>← 左のサイドバーからノートを選ぶか、「+」で新規作成してください</p>
      </div>
    );
  }

  const previewHtml = renderMarkdown(activeNote.content);

  return (
    <div className="editor-area">
      <div className="editor-area__title-row">
        <input
          className="editor-area__title-input"
          type="text"
          placeholder="タイトルを入力..."
          value={activeNote.title}
          onChange={e => onTitleChange(e.target.value)}
        />
      </div>
      <div className="editor-area__panes">
        <textarea
          className={`editor-area__editor ${mobileTab === 'preview' ? 'editor-area__editor--hidden' : ''}`}
          placeholder={`# 見出し\n**太字** *斜体*\n- 箇条書き\n1. 番号付きリスト\n\`コード\`\n> 引用`}
          value={activeNote.content}
          onChange={e => onContentChange(e.target.value)}
          spellCheck={false}
        />
        <div
          className={`editor-area__preview ${mobileTab === 'edit' ? 'editor-area__preview--hidden' : ''}`}
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      </div>
    </div>
  );
}
