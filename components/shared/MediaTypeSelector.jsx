import { useState } from "react";
import Image from "next/image";

const MediaTypeSelector = ({ onTypeChange }) => {
  const [selectedType, setSelectedType] = useState("video");

  const handleSelection = (type) => {
    setSelectedType(type);
    onTypeChange(type);
  };

  return (
    <div className="flex space-x-4">
      <div
        className="flex items-center cursor-pointer space-x-2"
        onClick={() => handleSelection("video")}
      >
        <Image
          src={
            selectedType === "video"
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
            selectedType === "video" ? "text-primary-light" : "text-slate-600"
          }`}
        >
          Video
        </p>
      </div>

      <div
        className="flex items-center cursor-pointer space-x-2"
        onClick={() => handleSelection("audio")}
      >
        <Image
          src={
            selectedType === "audio"
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
            selectedType === "audio" ? "text-primary-light" : "text-slate-600"
          }`}
        >
          Audio
        </p>
      </div>

      <div
        className="flex items-center cursor-pointer space-x-2"
        onClick={() => handleSelection("pdf")}
      >
        <Image
          src={
            selectedType === "pdf"
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
            selectedType === "pdf" ? "text-primary-light" : "text-slate-600"
          }`}
        >
          PDF
        </p>
      </div>
    </div>
  );
};

export default MediaTypeSelector;
