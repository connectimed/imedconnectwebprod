import React from "react";

const OverviewCard = ({ text, number }) => {
  return (
    <div className="flex flex-row justify-between items-center tracking-wide">
      <p className="text-small-regular">{text}</p>
      <p className="text-subtle-regular w-10 py-0.5 bg-primary-light/40 text-primary-deep-light text-center rounded-full">
        {number}
      </p>
    </div>
  );
};

export default OverviewCard;
