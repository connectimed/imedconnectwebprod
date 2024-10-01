import React from "react";

const Toast = ({ message }) => {
  return (
    <div className="toast toast-top toast-center z-[2] mt-10">
      <div className="rounded-lg bg-success-1 flex items-center px-6 py-1.5 shadow-md">
        <span className="text-small-regular font-normal text-white tracking-wide">
          {message}
        </span>
      </div>
    </div>
  );
};

export default Toast;
