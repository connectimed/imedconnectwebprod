import React, { useState, useEffect } from "react";

const Modal = ({
  isOpen,
  onClose,
  options,
  selectedOptions,
  onSelectionChange,
}) => {
  const [localSelectedOptions, setLocalSelectedOptions] = useState([]);

  useEffect(() => {
    setLocalSelectedOptions(selectedOptions);
  }, [selectedOptions]);

  const handleCheckboxChange = (option) => {
    const updatedSelectedOptions = localSelectedOptions.includes(option)
      ? localSelectedOptions.filter((item) => item !== option)
      : [...localSelectedOptions, option];

    setLocalSelectedOptions(updatedSelectedOptions);
    onSelectionChange(updatedSelectedOptions);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      <div
        className="absolute inset-0 bg-black opacity-20"
        onClick={onClose}
      ></div>
      <div className="relative bg-white px-4 py-6 max-w-md rounded-xl z-10 mx-4">
        <h2 className="text-body-bold mb-4">Select areas of interest</h2>
        <ul>
          {options.map((option) => (
            <li key={option} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={option}
                className="mr-2 cursor-pointer accent-primary-deep-light text-white"
                checked={localSelectedOptions.includes(option)}
                onChange={() => handleCheckboxChange(option)}
              />
              <label
                htmlFor={option}
                className="cursor-pointer text-base-regular text-start"
              >
                {option}
              </label>
            </li>
          ))}
        </ul>
        <div className="flex flex-row items-center justify-end w-full mt-5">
          <button
            className="text-slate-500 text-small-regular outline-none tracking-wide border rounded-lg px-6 py-1.5"
            onClick={onClose}
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
