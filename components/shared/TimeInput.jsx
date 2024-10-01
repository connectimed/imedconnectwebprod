import React, { useEffect } from "react";

const TimeInput = ({ hours, minutes, onHoursChange, onMinutesChange }) => {
  useEffect(() => {
    validateTime();
  }, [hours, minutes]);

  const validateTime = () => {
    if (hours > 23) {
      onHoursChange("");
    }
    if (minutes > 59) {
      onMinutesChange("");
    }
  };

  const handleHoursChange = (e) => {
    const value = e.target.value;
    if (value >= 0 && value <= 23) {
      onHoursChange(value);
    } else {
      onHoursChange("");
    }
  };

  const handleMinutesChange = (e) => {
    const value = e.target.value;
    if (value >= 0 && value <= 59) {
      onMinutesChange(value);
    } else {
      onMinutesChange("");
    }
  };

  return (
    <div className="flex gap-2 text-x-small-regular">
      <input
        type="number"
        value={hours}
        onChange={handleHoursChange}
        placeholder="HH"
        className="w-20 py-2 border rounded-md border-gray-300 ps-4 pe-2 text-slate-700 focus:border-primary-light placeholder:text-slate-400 outline-none"
        min="0"
        max="23"
      />
      <input
        type="number"
        value={minutes}
        onChange={handleMinutesChange}
        placeholder="MM"
        className="w-20 py-2 border rounded-md border-gray-300 ps-4 pe-2 text-slate-700 focus:border-primary-light placeholder:text-slate-400 outline-none"
        min="0"
        max="59"
      />
    </div>
  );
};

export default TimeInput;
