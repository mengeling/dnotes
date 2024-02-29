import { Dispatch } from "redux";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Web5 } from "@web5/api";

import { client } from "../api/client";
import { useAppSelector } from "../redux/hooks";
import {
  setAddNote,
  setRemoveNote,
  setNotes,
  setUpdateNote,
} from "../redux/notes";
import { Note, Notes } from "../redux/notes";
import { formatTimestamp } from "../utils";

const createNoteRecord = async (web5, data) => {
  const { record } = await web5.dwn.records.create({
    data,
    message: {
      schema: "http://some-schema-registry.org/note",
      dataFormat: "application/json",
    },
  });
  return record;
};

const updateNoteRecord = async (web5, data, recordId) => {
  const { record } = await web5.dwn.records.read({
    message: {
      filter: {
        recordId,
      },
    },
  });
  await record.update({ data });
  return record;
};

const getNoteData = async (record) => {
  const data = await record.data.json();
  return {
    ...data,
    id: record.id,
    createdAt: record.dateCreated,
    modifiedAt: record.dateModified,
  };
};

const UnconnectedNoteBody = ({
  setAddNote,
  setNotes,
  setRemoveNote,
  setUpdateNote,
}) => {
  const [web5, setWeb5] = useState(null);
  const [myDid, setMyDid] = useState("");
  const [newNoteIsOpen, selectedNote] = useAppSelector((state) => [
    state.notesReducer.newNoteIsOpen,
    state.notesReducer.selectedNote,
  ]);

  useEffect(() => {
    const connectToWeb5 = async () => {
      const { web5, did: myDid } = await Web5.connect();
      setWeb5(web5);
      setMyDid(myDid);
    };

    connectToWeb5();
  });

  const createNote = async () => {
    const record = await createNoteRecord(web5, {
      title: "",
      tag: "",
      note: "",
    });
    const note = await getNoteData(record);
    console.log(note);
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
      console.log(data);
      console.log(selectedNote);

      const record = !selectedNote
        ? await createNoteRecord(web5, data)
        : await updateNoteRecord(web5, data, selectedNote.id);

      // const record = await updateNoteRecord(web5, data, selectedNote.id);
      const note = await getNoteData(record);
      console.log(note);

      // const { record } = await web5.dwn.records.create({
      //   data: body,
      //   message: {
      //     schema: "http://some-schema-registry.org/note",
      //     dataFormat: "application/json",
      //   },
      // });

      // const note = await record.data.json();
      // const fullNote = {
      //   ...note,
      //   id: record.id,
      //   createdAt: record.dateCreated,
      //   modifiedAt: record.dateModified,
      // };
      // console.log(fullNote);

      // const response = await client.put(
      //   `http://localhost:5000/api/notes/${selectedNote.id}`,
      //   body
      // );
      setUpdateNote(note);
    };

  const deleteNote = async () => {
    // const response = await client.delete(
    //   `http://localhost:5000/api/notes/${selectedNote.id}`
    // );
    // setRemoveNote(parseInt(response.noteId));
  };

  return (
    <div className="note-wrapper">
      <div className="note-header">
        <p className="note-header-date">
          Last Edited on {formatTimestamp(selectedNote?.updatedAt)}
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
  setNotes: (notes: Notes) => dispatch(setNotes(notes)),
  setRemoveNote: (id: string) => dispatch(setRemoveNote(id)),
  setUpdateNote: (note: Note) => dispatch(setUpdateNote(note)),
});

export default connect(null, mapDispatchToProps)(UnconnectedNoteBody);
