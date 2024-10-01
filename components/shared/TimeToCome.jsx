import { useEffect, useState } from "react";
import "firebase/firestore";

const TimeToCome = ({ timestamp, type }) => {
  const [futureDate, setFutureDate] = useState("");

  useEffect(() => {
    const calculateFutureDate = (date, type) => {
      const futureDate = new Date(date);
      if (type === "Y") {
        futureDate.setFullYear(futureDate.getFullYear() + 1);
      } else if (type === "M") {
        futureDate.setMonth(futureDate.getMonth() + 1);
      }
      return futureDate.toLocaleDateString();
    };

    const lastInteractionTime = timestamp.toDate();
    setFutureDate(calculateFutureDate(lastInteractionTime, type)); // Calculate future date based on type
  }, [timestamp, type]);

  return (
    <div>
      <p>Future date from the timestamp: {futureDate}</p>
    </div>
  );
};

export default TimeToCome;
