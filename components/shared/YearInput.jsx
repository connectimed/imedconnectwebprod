import React, { useState } from "react";

const YearInput = ({ onChange }) => {
  const [year, setYear] = useState(1980);

  const incrementYear = () => {
    if (year < 2024) {
      const newYear = year + 1;
      setYear(newYear);
      if (onChange) {
        onChange(newYear);
      }
    }
  };

  const decrementYear = () => {
    if (year > 1980) {
      const newYear = year - 1;
      setYear(newYear);
      if (onChange) {
        onChange(newYear);
      }
    }
  };

  return (
    <div className="relative w-full ">
      <div className="flex items-center mt-1">
        <button
          type="button"
          onClick={decrementYear}
          className="px-3 py-2 text-black bg-blue-500 border border-slate-300 rounded-l-md hover:bg-slate-300 text-base-medium"
        >
          -
        </button>
        <div
          id="year"
          className="flex items-center justify-center w-full px-3 py-2 border-t border-b border-slate-300 text-base-medium text-slate-700"
        >
          {year}
        </div>
        <button
          type="button"
          onClick={incrementYear}
          className="px-3 py-2 text-black bg-blue-500 border border-slate-300 rounded-r-md hover:bg-slate-300 text-base-medium"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default YearInput;
