import React, { useState, useEffect, useRef } from "react";

const RegionsComboBox = ({ regions, onChange, placeholder }) => {
  const [query, setQuery] = useState("");
  const [filteredRegions, setFilteredRegions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setFilteredRegions(
      regions.filter((region) =>
        region.label.toLowerCase().includes(value.toLowerCase())
      )
    );
    setIsDropdownOpen(true);
  };

  const handleOptionClick = (region) => {
    setQuery(region.label);
    setIsDropdownOpen(false);
    if (onChange) {
      onChange(region);
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
        className="w-full py-2 bg-transparent border rounded-md border-gray-300 px-4 text-slate-700 focus:border-primary-light placeholder:text-slate-400 text-small-regular outline-none"
      />
      {isDropdownOpen && filteredRegions.length > 0 && (
        <ul className="absolute left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-md max-h-40 overflow-auto text-slate-600 text-small-regular">
          {filteredRegions.map((region) => (
            <li
              key={region.value}
              onClick={() => handleOptionClick(region)}
              className="pl-4 pr-2 py-2 cursor-pointer hover:bg-gray-200"
            >
              {region.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RegionsComboBox;
