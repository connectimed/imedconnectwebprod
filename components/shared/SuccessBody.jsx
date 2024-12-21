import React from "react";

const SuccessBody = ({ text }) => {
  return (
    <div className="w-full bg-success-2 text-success-1 text-center text-small-regular py-1.5 rounded-md tracking-wide">
      {text}
    </div>
  );
};

export default SuccessBody;
