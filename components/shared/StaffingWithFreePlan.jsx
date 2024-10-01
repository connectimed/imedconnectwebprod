import Image from "next/image";
import React from "react";

const StaffingWithFreePlan = ({ userData, branchData }) => {
  return (
    <section>
      {userData.user_plan === "-" ? (
        <div className="rounded-xl border border-gray-100 bg-amber-200 p-4 mb-6">
          <div className="flex items-start gap-2">
            <Image
              className="h-4 w-4 m-1"
              src="/icons/info-circle.svg"
              height={100}
              width={100}
              alt="info icon"
            />

            <div className="flex-1">
              <strong className="block font-medium text-gray-900 text-base-regular">
                You are on a free plan
              </strong>

              <p className="mt-1 text-small-regular text-gray-500">
                KagoPoint doesn't allow adding staff to branches while on a free
                plan. Please upgrade to get full benefit.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </section>
  );
};

export default StaffingWithFreePlan;
