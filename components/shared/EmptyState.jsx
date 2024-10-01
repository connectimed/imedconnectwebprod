import Link from "next/link";
import React from "react";

const EmptyState = ({ title, desc }) => {
  return (
    <div>
      <div className="w-full max-w-80 mx-auto">
        <div
          className="flex flex-col items-center w-full text-center mx-auto py-12"
          colspan="5"
        >
          <img
            className="w-12 h-12 mx-auto mb-4 opacity-40"
            src="/icons/blank-page.svg"
            alt="image empty states"
          />
          <p className="text-gray-700 font-bold text-base-medium text-center">
            {title}
          </p>
          <p className="text-gray-500 text-center text-small-regular max-w-sm mt-2">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
