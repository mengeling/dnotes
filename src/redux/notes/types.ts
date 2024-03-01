export interface NoteInputs {
  title: string;
  note: string;
  tag: string;
}

export interface Note extends NoteInputs {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notes extends Array<Note> {}
