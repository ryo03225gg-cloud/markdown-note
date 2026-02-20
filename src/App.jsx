import { useState } from 'react';
import { useNotes } from './hooks/useNotes';
import Sidebar from './components/Sidebar';
import MobileTabBar from './components/MobileTabBar';
import EditorArea from './components/EditorArea';
import './App.css';

function App() {
  const { notes, activeNoteId, activeNote, createNote, updateNote, deleteNote, selectNote } = useNotes();
  const [mobileTab, setMobileTab] = useState('edit');

  return (
    <div className="app">
      <Sidebar
        notes={notes}
        activeNoteId={activeNoteId}
        onSelect={selectNote}
        onCreate={createNote}
        onDelete={deleteNote}
      />
      <div className="app__main">
        <MobileTabBar mobileTab={mobileTab} onTabChange={setMobileTab} />
        <EditorArea
          activeNote={activeNote}
          mobileTab={mobileTab}
          onTitleChange={val => updateNote({ title: val })}
          onContentChange={val => updateNote({ content: val })}
        />
      </div>
    </div>
  );
}

export default App;
