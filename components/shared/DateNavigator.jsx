import { format, addDays, isBefore, isAfter, startOfDay } from "date-fns";
import Image from "next/image";
import React, { useState } from "react";

const DateNavigator = ({ initialDate = new Date(), onDateChange }) => {
  const [currentDate, setCurrentDate] = useState(initialDate);

  // Reset the time of today to 00:00:00
  const today = startOfDay(new Date());

  // Date 7 days from today (also with time reset)
  const maxDate = startOfDay(addDays(today, 7));

  // Format the current date to "Thursday, 26 September 2024"
  const formattedDate = format(currentDate, "EEEE, dd MMMM yyyy");

  // Function to handle moving left or right by days
  const handleDateChange = (days) => {
    const newDate = startOfDay(addDays(currentDate, days));

    // Prevent going back past today or forward more than 7 days
    if (isBefore(newDate, today)) {
      return; // Prevent moving past today
    }
    if (isAfter(newDate, maxDate)) {
      return; // Prevent moving beyond 7 days from today
    }

    // Set the new date if it's within valid range
    setCurrentDate(newDate);
    if (onDateChange) {
      onDateChange(newDate); // Pass the new date back to the parent component
    }
  };

  return (
    <div className="flex items-center justify-evenly space-x-2 tracking-wide">
      {/* Left arrow for previous day */}
      <button
        className="py-1.5 px-4 rounded-md bg-primary-blue/40 text-white text-base-regular shadow-none"
        onClick={() => handleDateChange(-1)}
        disabled={isBefore(addDays(currentDate, -1), today)}
      >
        <Image
          alt="icon"
          className="h-5 w-5"
          src="icons/left-arrow.svg"
          height={512}
          width={512}
        />
      </button>

      {/* Formatted date */}
      <div className="w-full border rounded-md text-center text-small-regular text-slate-500 py-1.5">
        {formattedDate}
      </div>

      {/* Right arrow for next day */}
      <button
        className="py-1.5 px-4 rounded-md bg-primary-blue/40 text-white text-base-regular"
        onClick={() => handleDateChange(1)}
        disabled={isAfter(addDays(currentDate, 1), maxDate)}
      >
        <Image
          alt="icon"
          className="h-5 w-5"
          src="icons/right-arrow.svg"
          height={512}
          width={512}
        />
      </button>
    </div>
  );
};

export default DateNavigator;
