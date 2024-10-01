import React from "react";

const Submitter = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-75 z-50 flex items-center justify-center">
      <img
        className="h-6 w-6 animate-spin"
        src="/icons/spinning.svg"
        alt="Error"
      />
    </div>
  );
};

export default Submitter;
