import { Timestamp } from "firebase/firestore";

const calculateDateAndTime = (timestamp) => {
  const date = timestamp.toDate();

  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  return new Intl.DateTimeFormat("en-GB", options).format(date);
};

export default calculateDateAndTime;
