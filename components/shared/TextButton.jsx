import React from "react";

const TextButton = ({ text, action }) => {
  return (
    <button
      className="text-small-regular cursor-pointer py-2 px-4 text-slate-400 w-full"
      onClick={action}
    >
      {text}
    </button>
  );
};

export default TextButton;
