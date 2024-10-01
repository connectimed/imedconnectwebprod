import Image from "next/image";
import React from "react";

const MentorHero = ({ userData }) => {
  const today = new Date();
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  };
  const todayFormatted = new Intl.DateTimeFormat("en-US", options).format(
    today
  );

  return (
    <div className="flex flex-row justify-between items-center bg-gradient-to-r from-primary-light to-primary-deep-light w-full px-6 py-4 rounded-xl">
      <div>
        <p className="text-small-regular text-slate-200">{todayFormatted}</p>
        <p className="text-body-bold md:text-heading3-bold text-white mt-6 md:mt-10 tracking-wide">
          Welcome back, {userData.user_full_name.split(" ")[0]}
        </p>
        <p className="text-subtle-regular md:text-small-regular text-slate-200 tracking-wide">
          You have a total of {userData.user_modules.length} modules.
        </p>
      </div>
      <div>
        <Image
          className="h-16 w-16 md:h-28 md:w-28"
          src="/images/mentor-hero.png"
          height={512}
          width={512}
          alt="search icon"
        />
      </div>
    </div>
  );
};

export default MentorHero;
