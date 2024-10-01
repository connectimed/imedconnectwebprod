import { Timestamp } from "firebase/firestore";
import { formatDistanceToNow, format } from "date-fns";

// Utility function to calculate start time
export const calculateStartTime = (timestamp) => {
  if (!timestamp) {
    return "";
  }

  const startTime = timestamp.toDate();
  const now = new Date();

  // Calculate the difference in time
  const differenceInMilliseconds = startTime - now;

  // If the event is in the future
  if (differenceInMilliseconds > 0) {
    // If the event starts in less than 24 hours
    if (differenceInMilliseconds < 24 * 60 * 60 * 1000) {
      return `Starts in ${formatDistanceToNow(startTime, { addSuffix: true })}`;
    } else {
      // If the event starts in more than 24 hours
      return `Starts on ${format(startTime, "MMMM d, yyyy 'at' HH:mm")}`;
    }
  } else {
    // If the event is in the past
    return `Started on ${format(startTime, "MMMM d, yyyy 'at' HH:mm")}`;
  }
};
