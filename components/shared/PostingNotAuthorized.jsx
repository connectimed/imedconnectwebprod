import Image from "next/image";
import React from "react";

const PostingNotAuthorized = ({ userData, branchData }) => {
  return (
    <section>
      {userData.user_depot_branch_role !== "Branch Manager" &&
        userData.user_depot_branch_role !== "Branch Admin" && (
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
                  You are not authorized {userData.user_depot_branch_role}
                </strong>

                <p className="mt-1 text-small-regular text-gray-500">
                  You are not authorized to add records to{" "}
                  {branchData.branch_name}. Only a branch manager and and admin
                  can add records.
                </p>
              </div>
            </div>
          </div>
        )}
    </section>
  );
};

export default PostingNotAuthorized;
