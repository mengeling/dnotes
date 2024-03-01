import { Dispatch } from "redux";
import React, { useEffect } from "react";
import { connect } from "react-redux";

import { useWeb5 } from "../context/Web5Context";
import { useAppSelector } from "../redux/hooks";
import { Note, Notes, setNotes, setSelectedNote } from "../redux/notes";
import { formatTimestampShort, getNoteRecords } from "../utils";

const UnconnectedNotes = ({ setNotes, setSelectedNote }) => {
  const web5 = useWeb5();
  const notes = useAppSelector((state) => state.notes.notes);

  useEffect(() => {
    if (web5) {
      const getNotes = async () => {
        const notes = await getNoteRecords(web5);
        setNotes(notes);
      };
      getNotes();
    }
  }, [setNotes, web5]);

  const onClick = (noteId: string) => (e: React.SyntheticEvent) => {
    setSelectedNote(noteId);
  };

  return (
    <div className="notes-wrapper">
      {notes.map((note: Note) => (
        <button
          key={note.id}
          className="sidenav-note-button"
          onClick={onClick(note.id)}
          id={note.id.toString()}
        >
          <h4 className="sidenav-note title">{note.title || "Untitled"}</h4>
          <p className="sidenav-note body">{note.note}</p>
          <p className="sidenav-note date">
            {formatTimestampShort(note.updatedAt)}
          </p>
        </button>
      ))}
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setNotes: (notes: Notes) => dispatch(setNotes(notes)),
  setSelectedNote: (id: string) => dispatch(setSelectedNote(id)),
});

export default connect(null, mapDispatchToProps)(UnconnectedNotes);
