import Image from "next/image";
import React from "react";

const StudentHero = ({ userData }) => {
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
    <div className="flex flex-row justify-between bg-gradient-to-r from-primary-light to-primary-deep-light w-full px-6 py-4 rounded-xl">
      <div className="tracking-wide ">
        <p className="text-small-regular text-slate-200">{todayFormatted}</p>
        <p className="text-heading3-bold text-white mt-10 tracking-wide">
          Welcome back, {userData.user_full_name.split(" ")[0]}
        </p>
        <p className="text-small-regular text-slate-200">
          You are studying {userData.user_modules.length} modules and taken{" "}
          {Object.keys(userData.user_exams).length} exams. That's{" "}
          {userData.user_modules.length === 0
            ? "0"
            : ((userData.user_modules.length +
                Object.keys(userData.user_exams).length) *
                50) /
              userData.user_modules.length}
          % progress
        </p>
        <div className="w-full bg-gray-300 rounded-full h-3 mt-1">
          <div
            className="bg-primary-blue h-3 rounded-full"
            style={{
              width: `${
                userData.user_modules.length === 0
                  ? 0
                  : ((userData.user_modules.length +
                      Object.keys(userData.user_exams).length) *
                      50) /
                    userData.user_modules.length
              }%`,
            }}
          ></div>
        </div>
      </div>
      <div className="">
        <Image
          className="h-28 w-28 object-contain"
          src="/images/gradhat.png"
          height={512}
          width={512}
          alt=" icon"
        />
      </div>
    </div>
  );
};

export default StudentHero;
