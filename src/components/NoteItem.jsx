import './NoteItem.css';

export default function NoteItem({ note, isActive, onSelect, onDelete }) {
  function handleDelete(e) {
    e.stopPropagation();
    const confirmed = window.confirm('このノートを削除しますか？');
    if (confirmed) onDelete(note.id);
  }

  return (
    <div
      className={`note-item ${isActive ? 'note-item--active' : ''}`}
      onClick={() => onSelect(note.id)}
    >
      <span className="note-item__title">
        {note.title.trim() || '無題'}
      </span>
      <button
        className="note-item__delete"
        onClick={handleDelete}
        aria-label="削除"
      >
        🗑
      </button>
    </div>
  );
}
