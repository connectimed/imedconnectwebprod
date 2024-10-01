import institutions from "@/constants/institutions";
import React, { useState, useEffect, useRef } from "react";

const InstitutionsComboBox = ({
  onChange,
  placeholder,
  selectedInstitution,
}) => {
  const [query, setQuery] = useState("");
  const [filteredInstitutions, setFilteredInstitutions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setQuery(selectedInstitution ? selectedInstitution : "");
  }, [selectedInstitution]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setFilteredInstitutions(
      institutions.filter((institution) =>
        institution.toLowerCase().includes(value.toLowerCase())
      )
    );
    setIsDropdownOpen(true);
  };

  const handleOptionClick = (institution) => {
    setQuery(institution);
    setIsDropdownOpen(false);
    if (onChange) {
      onChange(institution);
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
        className="w-full py-2 bg-transparent border rounded-md border-gray-300 px-4 text-slate-700 focus:border-primary-light placeholder:text-slate-400 text-small-regular"
      />
      {isDropdownOpen && filteredInstitutions.length > 0 && (
        <ul className="absolute left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-md max-h-40 overflow-auto text-slate-600 text-small-regular">
          {filteredInstitutions.map((institution, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(institution)}
              className="pl-4 pr-2 py-2 cursor-pointer hover:bg-gray-200"
            >
              {institution}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InstitutionsComboBox;
