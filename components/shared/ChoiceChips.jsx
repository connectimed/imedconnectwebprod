import React from "react";

const ChoiceChips = ({ choices, selectedChoice, onSelectChoice }) => {
  const getLabel = (c) => (typeof c === "object" ? c.label : c);
  const getValue = (c) => (typeof c === "object" ? c.value : c);

  return (
    <div className="flex flex-wrap gap-2">
      {choices.map((choice, index) => (
        <div
          key={index}
          className={`px-4 py-1.5 border rounded-full cursor-pointer text-small-regular tracking-wide ${
            selectedChoice === getValue(choice)
              ? "bg-primary-light text-white"
              : "bg-gray-200 text-gray-500"
          }`}
          onClick={() => onSelectChoice(getValue(choice))}
        >
          {getLabel(choice)}
        </div>
      ))}
    </div>
  );
};

export default ChoiceChips;
