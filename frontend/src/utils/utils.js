export const formatDate = (date) => {
  let formatteddate = new Date(date);
  return `${formatteddate
    .toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    })
    .split("/")
    .join("-")} ${formatteddate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true, // Set to false for 24-hour format
  })}`;
};
