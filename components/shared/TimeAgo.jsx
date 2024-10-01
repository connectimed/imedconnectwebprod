import { useEffect, useState } from "react";
import "firebase/firestore";

const TimeAgo = ({ timestamp }) => {
  const [status, setStatus] = useState("");

  useEffect(() => {
    const calculateTimeAgo = () => {
      const currentTime = new Date();
      const lastInteractionTime = timestamp.toDate(); // Convert Firebase timestamp to JavaScript Date object
      const timeDifference = currentTime - lastInteractionTime;
      const minutesDifference = Math.floor(timeDifference / (1000 * 60));

      if (minutesDifference <= 2) {
        setStatus("Now");
      } else if (minutesDifference > 2 && minutesDifference <= 60) {
        // Calculate minutes ago
        const minutesAgo = Math.floor(minutesDifference);
        setStatus(`${minutesAgo}m ago`);
      } else if (minutesDifference > 60 && minutesDifference <= 1440) {
        // Calculate hours ago
        const hoursAgo = Math.floor(minutesDifference / 60);
        setStatus(`${hoursAgo}h ago`);
      } else if (minutesDifference > 1440 && minutesDifference <= 43200) {
        // Calculate days ago
        const daysAgo = Math.floor(minutesDifference / (60 * 24));
        setStatus(`${daysAgo}d ago`);
      } else {
        // Calculate months ago
        setStatus(`Long ago`);
      }
    };

    calculateTimeAgo(); // Initial calculation

    // Update the status every minute
    const intervalId = setInterval(calculateTimeAgo, 60 * 1000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [timestamp]);

  return <p>{status}</p>;
};

export default TimeAgo;
