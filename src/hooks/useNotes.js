import { useState, useEffect } from 'react';

const STORAGE_KEY = 'markdown-note-data';

const SAMPLE_NOTE = {
  id: 'sample',
  title: 'マークダウンの使い方',
  content: `# 見出し1
## 見出し2
### 見出し3

**太字** と *斜体* が使えます。

- 箇条書き1
- 箇条書き2
  - ネストした箇条書き

1. 番号付きリスト1
2. 番号付きリスト2

\`\`\`
コードブロック
const hello = "world";
\`\`\`

インライン \`コード\` も使えます。

> 引用文はこのように書きます。

---

右ペインにリアルタイムでプレビューが表示されます。`,
  updatedAt: new Date().toISOString(),
};

function load() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }
  return { notes: [SAMPLE_NOTE], activeNoteId: SAMPLE_NOTE.id };
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useNotes() {
  const [data, setData] = useState(load);

  useEffect(() => {
    save(data);
  }, [data]);

  const { notes, activeNoteId } = data;
  const activeNote = notes.find(n => n.id === activeNoteId) ?? null;

  function createNote() {
    const newNote = {
      id: Date.now().toString(),
      title: '',
      content: '',
      updatedAt: new Date().toISOString(),
    };
    setData(prev => ({
      notes: [newNote, ...prev.notes],
      activeNoteId: newNote.id,
    }));
  }

  function updateNote(changes) {
    setData(prev => ({
      ...prev,
      notes: prev.notes.map(n =>
        n.id === prev.activeNoteId
          ? { ...n, ...changes, updatedAt: new Date().toISOString() }
          : n
      ),
    }));
  }

  function deleteNote(id) {
    setData(prev => {
      const newNotes = prev.notes.filter(n => n.id !== id);
      const newActiveId =
        prev.activeNoteId === id
          ? newNotes.length > 0 ? newNotes[0].id : null
          : prev.activeNoteId;
      return { notes: newNotes, activeNoteId: newActiveId };
    });
  }

  function selectNote(id) {
    setData(prev => ({ ...prev, activeNoteId: id }));
  }

  return { notes, activeNoteId, activeNote, createNote, updateNote, deleteNote, selectNote };
}
