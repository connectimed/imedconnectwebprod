import React, { useEffect } from "react";

const DateInput = ({
  day,
  month,
  year,
  onDayChange,
  onMonthChange,
  onYearChange,
}) => {
  useEffect(() => {
    validateDay();
  }, [day, month, year]);

  const validateDay = () => {
    const daysInMonth = new Date(year || 0, month, 0).getDate();
    if (day > daysInMonth) {
      onDayChange("");
    }
  };

  const handleMonthChange = (e) => {
    const value = e.target.value;
    if (value > 12) {
      onMonthChange("");
    } else {
      onMonthChange(value);
    }
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    if (value.length <= 4) {
      onYearChange(value);
    }
  };

  return (
    <div className="flex gap-2 text-x-small-regular">
      <input
        type="number"
        value={day}
        onChange={(e) => onDayChange(e.target.value)}
        placeholder="DD"
        className=" w-20 py-2 border rounded-md border-gray-300 ps-4 pe-2 text-slate-700 focus:border-primary-light placeholder:text-slate-400 outline-none"
        min="1"
        max="31"
      />
      <input
        type="number"
        value={month}
        onChange={handleMonthChange}
        placeholder="MM"
        className="w-20 py-2 border rounded-md border-gray-300 ps-4 pe-2 text-slate-700 focus:border-primary-light placeholder:text-slate-400 outline-none"
        min="1"
        max="12"
      />
      <input
        type="number"
        value={year}
        onChange={handleYearChange}
        placeholder="YYYY"
        className="w-24 py-2 border rounded-md border-gray-300 ps-4 pe-2 text-slate-700 focus:border-primary-light placeholder:text-slate-400 outline-none"
        min="1900"
        max="2100"
      />
    </div>
  );
};

export default DateInput;
