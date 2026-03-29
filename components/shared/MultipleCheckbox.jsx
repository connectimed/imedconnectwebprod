import Image from "next/image";
import React, { useState } from "react";

const MultipleCheckbox = ({ options, selectedValues, onSelect }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getLabel = (o) => (typeof o === "object" ? o.label : o);
  const getValue = (o) => (typeof o === "object" ? o.value : o);

  const handleSelection = (value) => {
    if (selectedValues.includes(value)) {
      onSelect(selectedValues.filter((item) => item !== value));
    } else {
      onSelect([...selectedValues, value]);
    }
  };

  return (
    <div className="relative">
      <div
        className="w-full py-2 bg-transparent border rounded-md border-gray-300 px-4 text-slate-700 focus:border-primary-light placeholder:text-slate-400 text-small-regular outline-none tracking-wide cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {selectedValues.length > 0
          ? selectedValues.join(", ")
          : "Select one or more items"}
      </div>
      {isDropdownOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-slate-300 rounded-lg shadow-lg text-small-regular max-h-48 overflow-scroll">
          {options.map((option) => (
            <li
              key={getValue(option)}
              onClick={() => handleSelection(getValue(option))}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
            >
              <div className="flex flex-row space-x-2 items-center">
                <Image
                  className="h-4 w-4"
                  src={
                    selectedValues.includes(getValue(option))
                      ? "/icons/checked.svg"
                      : "/icons/unchecked.svg"
                  }
                  height={512}
                  width={512}
                  alt="icon"
                />
                <p>{getLabel(option)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultipleCheckbox;
