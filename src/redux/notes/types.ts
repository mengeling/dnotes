export interface Note {
  id: number;
  title: string;
  note: string;
  tag: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteInputs {
  title: string;
  note: string;
  tag: string;
}

export interface Notes extends Array<Note> {}
