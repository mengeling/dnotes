import { Note, Notes } from "redux/notes/types";

export const setAddNote = (note: Note) => ({
  type: "notes/setAddNote",
  payload: { note },
});

export const setNotes = (notes: Notes) => ({
  type: "notes/setNotes",
  payload: { notes },
});

export const setRemoveNote = (id: string) => ({
  type: "notes/setRemoveNote",
  payload: { id },
});

export const setSelectedNote = (id: string) => ({
  type: "notes/setSelectedNote",
  payload: { id },
});

export const setUpdateNote = (note: Note) => ({
  type: "notes/setUpdateNote",
  payload: { note },
});
