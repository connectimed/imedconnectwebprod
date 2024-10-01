import React from "react";

const QuestionChoiceChips = ({ choices, selectedChoice, onSelectChoice }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {choices.map((choice, index) => (
        <div
          key={index}
          className={`px-4 py-1.5 border rounded-full cursor-pointer text-small-regular tracking-wide ${
            selectedChoice === choice
              ? "bg-primary-light text-white"
              : "bg-gray-200 text-gray-500"
          }`}
          onClick={() => onSelectChoice(choice)}
        >
          {choice}
        </div>
      ))}
    </div>
  );
};

export default QuestionChoiceChips;
