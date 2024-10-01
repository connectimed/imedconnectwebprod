import { useState } from "react";
import Image from "next/image";

const QuestionTypeSelector = ({ onTypeChange }) => {
  const [selectedType, setSelectedType] = useState("Multiple Choices");

  const handleSelection = (type) => {
    setSelectedType(type);
    onTypeChange(type);
  };

  return (
    <div className="flex space-x-4">
      <div
        className="flex items-center cursor-pointer space-x-2"
        onClick={() => handleSelection("Multiple Choices")}
      >
        <Image
          src={
            selectedType === "Multiple Choices"
              ? "/icons/radio-active.svg"
              : "/icons/radio-inactive.svg"
          }
          className="h-5 w-5"
          height={512}
          width={512}
          alt="Video Icon"
        />
        <p
          className={` text-small-regular ${
            selectedType === "Multiple Choices"
              ? "text-primary-light"
              : "text-slate-600"
          }`}
        >
          Multiple Choices
        </p>
      </div>

      <div
        className="flex items-center cursor-pointer space-x-2"
        onClick={() => handleSelection("True Or False")}
      >
        <Image
          src={
            selectedType === "True Or False"
              ? "/icons/radio-active.svg"
              : "/icons/radio-inactive.svg"
          }
          className="h-5 w-5"
          height={512}
          width={512}
          alt="Audio Icon"
        />
        <p
          className={` text-small-regular ${
            selectedType === "True Or False"
              ? "text-primary-light"
              : "text-slate-600"
          }`}
        >
          True Or False
        </p>
      </div>
    </div>
  );
};

export default QuestionTypeSelector;
