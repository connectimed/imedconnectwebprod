import React from "react";

const ProgressIndicator = ({ currentStep }) => {
  const totalSteps = 7;

  return (
    <div className="flex space-x-2 w-full">
      {[...Array(totalSteps)].map((_, index) => (
        <div
          key={index}
          className={`w-full h-2 rounded-full ${
            index < currentStep ? "bg-primary-light" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export default ProgressIndicator;
