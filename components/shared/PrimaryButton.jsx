import React from "react";

const PrimaryButton = ({ text, action }) => {
  return (
    <button
      className=" text-small-regular cursor-pointer py-2 px-4 border rounded-md bg-primary-light text-white"
      onClick={action}
    >
      {text}
    </button>
  );
};

export default PrimaryButton;
