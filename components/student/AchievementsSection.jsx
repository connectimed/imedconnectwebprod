import React from "react";
import Image from "next/image";

const AchievementsSection = () => {
  return (
    <div className="flex flex-col space-y-2">
      <p className="text-base-regular font-bold tracking-wide">Exams:</p>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        <div className="h-40 rounded-xl bg-primary-light-accent px-4 py-6 border-2 border-primary-deep-accent">
          <div className="flex flex-row justify-between items-start">
            <div className="flex flex-col space-y-2">
              <p className="font-bold text-heading3-bold text-primary-deep-accent max-w-64">
                Inorganic Chemistry Certificate
              </p>
              <button className="border rounded-full max-w-32 text-white bg-primary-deep-accent py-1 text-base-medium">
                View
              </button>
            </div>
            <Image
              // src="/icons/avatar-team.svg"
              src="/icons/medal.svg"
              className="h-20 w-20 object-cover"
              height={200}
              width={200}
              alt="image"
            />
          </div>
        </div>
        <div className="h-32 rounded-lg bg-gray-200"></div>
      </div>
    </div>
  );
};

export default AchievementsSection;
