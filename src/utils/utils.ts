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
