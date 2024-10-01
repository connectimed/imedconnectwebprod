import { Timestamp } from "firebase/firestore";
import { format } from "date-fns";

// Utility function to get date and month
export const getDateAndMonth = (timestamp) => {
  if (!timestamp) {
    return { date: "", month: "" };
  }

  const date = timestamp.toDate();
  const day = format(date, "d"); // Extract day of the month
  const month = format(date, "MMMM"); // Extract full month name

  return { date: day, month: month };
};
