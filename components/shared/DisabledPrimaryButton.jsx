import React from "react";

const DisabledPrimaryButton = ({ text, action }) => {
  return (
    <button
      className=" w-full text-small-regular cursor-not-allowed py-2 px-4 border rounded-md bg-primary-500/50 text-white"
      onClick={action}
    >
      {text}
    </button>
  );
};

export default DisabledPrimaryButton;
