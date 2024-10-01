import React from "react";

const MultipleChoiceChips = ({ choices, selectedChoices, onSelectChoice }) => {
  const handleSelectChoice = (choice) => {
    if (choice === "None") {
      onSelectChoice(["None"]);
    } else {
      const updatedChoices = selectedChoices.includes(choice)
        ? selectedChoices.filter((selected) => selected !== choice)
        : [...selectedChoices, choice].filter(
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
            selectedChoices.includes(choice)
              ? "bg-primary-light text-white"
              : "bg-gray-200 text-gray-500"
          }`}
          onClick={() => handleSelectChoice(choice)}
        >
          {choice}
        </div>
      ))}
    </div>
  );
};

export default MultipleChoiceChips;
