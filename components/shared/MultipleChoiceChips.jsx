import React from "react";

const MultipleChoiceChips = ({ choices, selectedChoices, onSelectChoice }) => {
  const getLabel = (c) => (typeof c === "object" ? c.label : c);
  const getValue = (c) => (typeof c === "object" ? c.value : c);

  const handleSelectChoice = (choice) => {
    const value = getValue(choice);
    if (value === "None") {
      onSelectChoice(["None"]);
    } else {
      const updatedChoices = selectedChoices.includes(value)
        ? selectedChoices.filter((selected) => selected !== value)
        : [...selectedChoices, value].filter(
            (selected) => selected !== "None"
          );
      onSelectChoice(updatedChoices);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {choices.map((choice, index) => (
        <div
          key={index}
          className={`px-4 py-1.5 border rounded-full cursor-pointer text-small-regular tracking-wide ${
            selectedChoices.includes(getValue(choice))
              ? "bg-primary-light text-white"
              : "bg-gray-200 text-gray-500"
          }`}
          onClick={() => handleSelectChoice(choice)}
        >
          {getLabel(choice)}
        </div>
      ))}
    </div>
  );
};

export default MultipleChoiceChips;
