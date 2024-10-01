import Image from "next/image";
import React from "react";

const PostingWithFreePlan = ({ userData, branchData }) => {
  return (
    <section>
      <div className="rounded-xl border border-gray-100 bg-amber-200 p-4 mb-6">
        <div className="flex items-start gap-2">
          <Image
            className="h-4 w-4 m-1"
            src="/icons/info-circle.svg"
            height={100}
            width={100}
          />

          <div className="flex-1">
            <strong className="block font-medium text-gray-900 text-base-regular">
              You are on a free plan
            </strong>

            <p className="mt-1 text-small-regular text-gray-500">
              KagoPoint allows you to keep package records on a free plan for up
              to 100 packages. Now you have {branchData.branch_packages_balance}{" "}
              packages left.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostingWithFreePlan;
