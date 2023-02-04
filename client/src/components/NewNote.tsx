import { Dispatch } from "redux";
import React, { useState } from "react";
import { connect } from "react-redux";

import { client } from "api/client";
import { Notes, setNewNoteIsOpen, setNotes } from "redux/notes";

const UnconnectedNewNote = ({ setNewNoteIsOpen, setNotes }) => {
  const [newNote, setNewNote] = useState({ title: "", tag: "", note: "" });

  const onChange =
    (field: string) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      setNewNote((prev) => {
        return { ...prev, [field]: e.target.value };
      });
    };

  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    await client.post("http://localhost:5000/api/notes", newNote);
    const response = await client.get("http://localhost:5000/api/notes");
    setNotes(response.notes);
    setNewNoteIsOpen(false);
  }

  async function handleCancel() {
    setNewNoteIsOpen(false);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={newNote.title}
            onChange={onChange("title")}
          />
        </label>
        <br />
        <label>
          Tag:
          <input type="text" value={newNote.tag} onChange={onChange("tag")} />
        </label>
        <br />
        <label>
          Note:
          <textarea value={newNote.note} onChange={onChange("note")} />
        </label>
        <br />
        <button type="submit">Add note</button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setNewNoteIsOpen: (newNoteIsOpen: boolean) =>
    dispatch(setNewNoteIsOpen(newNoteIsOpen)),
  setNotes: (notes: Notes) => dispatch(setNotes(notes)),
});

export default connect(null, mapDispatchToProps)(UnconnectedNewNote);
