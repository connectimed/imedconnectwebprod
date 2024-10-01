import React from "react";

const DangerButton = ({ text, action }) => {
  return (
    <button
      className=" text-small-regular cursor-pointer py-1.5 px-6 border rounded-lg tracking-wide bg-red-600 text-white"
      onClick={action}
    >
      {text}
    </button>
  );
};

export default DangerButton;
