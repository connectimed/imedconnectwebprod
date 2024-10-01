import Image from "next/image";
import React from "react";

const MiniProfileCard = ({ userInfo }) => {
  return (
    <div className="mx-6 rounded-lg border p-2 bg-primary-light/10">
      <div className="flex flex-row space-x-3">
        <Image
          className="rounded-md h-10 w-10 border-1 border-white object-cover p-1"
          height={300}
          width={300}
          src="/images/logout-icon.png"
          alt="author avatar"
        />
        <div className="flex flex-col justify-center max-w-32">
          <h3 className="text-black font-bold tracking-wide text-small-regular line-clamp-1">
            Log out
          </h3>
          <p className="text-slate-600 text-subtle-regular line-clamp-1 tracking-wide">
            Click to log out
          </p>
        </div>
      </div>
    </div>
  );
};

export default MiniProfileCard;
