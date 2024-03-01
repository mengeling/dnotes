import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Note } from "redux/notes/types";

const emptyNote: Note = {
  id: "",
  title: "",
  note: "",
  tag: "",
  createdAt: "",
  updatedAt: "",
};

export const initialState = {
  notes: [],
  selectedNote: emptyNote,
  newNoteIsOpen: false,
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setAddNote: (state, action: PayloadAction<{ note: Note }>) => {
      const addedNote = action.payload.note;
      state.notes = [addedNote].concat(state.notes);
      state.selectedNote = addedNote;
    },
    setNotes: (state, action: PayloadAction<{ notes: Note[] }>) => {
      const notes = action.payload.notes.sort((noteA: Note, noteB: Note) => {
        const noteADate = new Date(noteA.updatedAt);
        const noteBDate = new Date(noteB.updatedAt);
        return noteBDate.getTime() - noteADate.getTime();
      });
      state.notes = notes;
      if (notes.length !== 0) {
        state.selectedNote = notes[0];
      }
    },
    setRemoveNote: (state, action: PayloadAction<{ id: string }>) => {
      const notes = state.notes.filter(
        (note: Note) => note.id !== action.payload.id
      );
      state.notes = notes;
      if (notes.length !== 0) {
        state.selectedNote = notes[0];
      }
    },
    setSelectedNote: (state, action: PayloadAction<{ id: string }>) => {
      const note = state.notes.find(
        (note: Note) => note.id === action.payload.id
      );
      if (note) {
        state.selectedNote = note;
      }
    },
    setUpdateNote: (state, action: PayloadAction<{ note: Note }>) => {
      const updatedNote = action.payload.note;
      const notes = state.notes.filter(
        (note: Note) => note.id !== updatedNote.id
      );
      state.notes = [updatedNote].concat(notes);
      state.selectedNote = updatedNote;
    },
  },
});

export const notesReducer = notesSlice.reducer;
