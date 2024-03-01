import { Record, Web5 } from "@web5/api";

import { NoteInputs } from "../redux/notes";

const NOTE_SCHEMA = "http://some-schema-registry.org/note";

export const buildNoteFromRecord = async (record: Record) => {
  const data = await record.data.json();
  return {
    ...data,
    id: record.id,
    createdAt: record.dateCreated,
    updatedAt: record.dateModified,
  };
};

export const createNoteRecord = async (web5: Web5, data: NoteInputs) => {
  const { record } = await web5.dwn.records.create({
    data,
    message: {
      schema: NOTE_SCHEMA,
      dataFormat: "application/json",
    },
  });
  return record;
};

export const getNoteRecords = async (web5: Web5) => {
  const { records } = await web5.dwn.records.query({
    message: {
      filter: {
        schema: NOTE_SCHEMA,
      },
    },
  });
  const promises = records.map((record) => buildNoteFromRecord(record));
  return await Promise.all(promises);
};

export const updateNoteRecord = async (
  web5: Web5,
  data: NoteInputs,
  recordId: string
) => {
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

export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("default", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatTimestampShort = (timestamp: string) => {
  const date = new Date(timestamp);
  if (date.toDateString() === new Date().toDateString()) {
    return "Today";
  }
  return date.toLocaleDateString("default", {
    month: "short",
    day: "numeric",
  });
};
