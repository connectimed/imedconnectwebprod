import React, { useState } from "react";

const Interests = ({ options, selectedValue, onSelect }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelection = (value) => {
    onSelect(value);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <div
        className="w-full py-2 bg-transparent border rounded-md border-gray-300 px-4 text-slate-700 focus:border-primary-light placeholder:text-slate-400 text-small-regular outline-none tracking-wide cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {selectedValue}
      </div>
      {isDropdownOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-slate-300 rounded-lg shadow-lg text-small-regular max-h-48 overflow-scroll">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelection(option)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Interests;
