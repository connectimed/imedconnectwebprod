import React, { useState, useEffect, useRef } from "react";
import courses from "@/constants/courses";

const CoursesComboBox = ({ onChange, placeholder, selectedCourse }) => {
  const [query, setQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setQuery(selectedCourse ? selectedCourse.name : "");
  }, [selectedCourse]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setFilteredCourses(
      courses.filter((course) =>
        course.name.toLowerCase().includes(value.toLowerCase())
      )
    );
    setIsDropdownOpen(true);
  };

  const handleOptionClick = (course) => {
    setQuery(course.name);
    setIsDropdownOpen(false);
    if (onChange) {
      onChange(course);
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
      {isDropdownOpen && filteredCourses.length > 0 && (
        <ul className="absolute left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-md max-h-48 overflow-auto text-slate-600 text-small-regular">
          {filteredCourses.map((course, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(course)}
              className="pl-4 pr-2 py-2 cursor-pointer hover:bg-gray-200"
            >
              {course.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CoursesComboBox;
