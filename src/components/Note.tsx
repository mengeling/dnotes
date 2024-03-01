import { Dispatch } from "redux";
import React from "react";
import { connect } from "react-redux";

import { useWeb5 } from "../context/Web5Context";
import { useAppSelector } from "../redux/hooks";
import { Note, setAddNote, setRemoveNote, setUpdateNote } from "../redux/notes";
import {
  buildNoteFromRecord,
  createNoteRecord,
  formatTimestamp,
  updateNoteRecord,
} from "../utils";

const UnconnectedNoteBody = ({ setAddNote, setRemoveNote, setUpdateNote }) => {
  const web5 = useWeb5();
  const [newNoteIsOpen, selectedNote] = useAppSelector((state) => [
    state.notes.newNoteIsOpen,
    state.notes.selectedNote,
  ]);

  const createNote = async () => {
    const record = await createNoteRecord(web5, {
      title: "",
      tag: "",
      note: "",
    });
    const note = await buildNoteFromRecord(record);
    setAddNote(note);
  };

  const handleChange =
    (field: string) =>
    async (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      const isFieldTitle = field === "title";
      const data = isFieldTitle
        ? {
            title: e.target.value,
            note: selectedNote.note,
            tag: selectedNote.tag,
          }
        : {
            title: selectedNote.title,
            note: e.target.value,
            tag: selectedNote.tag,
          };
      const record =
        selectedNote.id === ""
          ? await createNoteRecord(web5, data)
          : await updateNoteRecord(web5, data, selectedNote.id);

      const note = await buildNoteFromRecord(record);
      setUpdateNote(note);
    };

  const deleteNote = async () => {
    await web5.dwn.records.delete({
      message: {
        recordId: selectedNote.id,
      },
    });
    setRemoveNote(selectedNote.id);
  };

  return (
    <div className="note-wrapper">
      <div className="note-header">
        <p className="note-header-date">
          {selectedNote.updatedAt === ""
            ? `Last Edited`
            : `Last Edited on ${formatTimestamp(selectedNote.updatedAt)}`}
        </p>
        <button className="note-header-delete-button" onClick={deleteNote}>
          <span className="note-header-delete-text">Delete</span>
        </button>
      </div>
      <div className="note">
        <div>
          <input
            type="text"
            className="note-text title"
            value={selectedNote.title}
            onChange={handleChange("title")}
            placeholder="Title"
          />
          <textarea
            className="note-text body"
            rows={20}
            value={selectedNote.note}
            onChange={handleChange("body")}
            placeholder="Start writing your note here"
          />
        </div>
      </div>
      <div className="note-footer">
        {!newNoteIsOpen && (
          <button className="newnote-button" onClick={createNote}>
            <i className="fa-solid fa-plus"></i>
            <span className="newnote-button-text">New</span>
          </button>
        )}
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setAddNote: (note: Note) => dispatch(setAddNote(note)),
  setRemoveNote: (id: string) => dispatch(setRemoveNote(id)),
  setUpdateNote: (note: Note) => dispatch(setUpdateNote(note)),
});

export default connect(null, mapDispatchToProps)(UnconnectedNoteBody);
