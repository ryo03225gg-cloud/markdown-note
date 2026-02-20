import NoteItem from './NoteItem';
import './Sidebar.css';

export default function Sidebar({ notes, activeNoteId, onSelect, onCreate, onDelete }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <span className="sidebar__title">📝 ノート</span>
        <button className="sidebar__create-btn" onClick={onCreate}>
          +
        </button>
      </div>
      <div className="sidebar__list">
        {notes.length === 0 ? (
          <p className="sidebar__empty">ノートがありません</p>
        ) : (
          notes.map(note => (
            <NoteItem
              key={note.id}
              note={note}
              isActive={note.id === activeNoteId}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </aside>
  );
}
