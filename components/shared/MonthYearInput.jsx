import React from "react";

const MonthYearInput = ({ month, year, onMonthChange, onYearChange }) => {
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

export default MonthYearInput;
