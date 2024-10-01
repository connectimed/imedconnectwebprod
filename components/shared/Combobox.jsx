import React, { useState, useEffect, useRef } from "react";

const Combobox = ({ options, onChange, placeholder, value }) => {
  const [query, setQuery] = useState(value?.label || "");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setQuery(value?.label || "");
  }, [value]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setQuery(inputValue);
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      )
    );
    setIsDropdownOpen(true);
  };

  const handleOptionClick = (option) => {
    setQuery(option.label);
    setIsDropdownOpen(false);
    if (onChange) {
      onChange(option);
    }
  };

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full max-w-md" ref={inputRef}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsDropdownOpen(true)}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {isDropdownOpen && filteredOptions.length > 0 && (
        <ul className="absolute left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-md max-h-60 overflow-auto">
          {filteredOptions.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className="p-2 cursor-pointer hover:bg-gray-200"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Combobox;
