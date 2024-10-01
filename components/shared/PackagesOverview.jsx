import Image from "next/image";
import React from "react";

const PackagesOverview = ({ desc, branchData }) => {
  return (
    <section>
      {desc ? (
        <div>
          {branchData && (
            <p className="mt-1 text-small-regular text-gray-500">
              The {branchData.branch_region}, {branchData.branch_district}{" "}
              branch of {branchData.branch_name} has recorded a total of{" "}
              {branchData.branch_total_packages} package
              {branchData.branch_total_packages === 1 ? "" : "s"}. Of which{" "}
              {branchData.branch_ready_packages}{" "}
              {branchData.branch_ready_packages === 1 ? "is" : "are"} ready to
              ship, {branchData.branch_shipped_packages}{" "}
              {branchData.branch_shipped_packages === 1 ? "has" : "have"} been
              shipped, {branchData.branch_arrived_packages}{" "}
              {branchData.branch_arrived_packages === 1 ? "has" : "have"}{" "}
              arrived, and {branchData.branch_delivered_packages}{" "}
              {branchData.branch_delivered_packages === 1 ? "has" : "have"} been
              delivered. Adding up to a total revenue of{" "}
              <span className="text-gray-600 font-bold">
                Tsh {branchData.branch_total_revenue.toLocaleString("en")}/=
              </span>
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-xl bg-white p-4 border-2 border-slate-200 mb-6">
          <div className="flex items-start gap-2">
            <Image
              className="h-4 w-4 m-1"
              src="/icons/bar-chart.svg"
              height={100}
              width={100}
            />

            <div className="flex-1">
              <strong className="block font-medium text-gray-900 text-base-regular">
                Branch Overview
              </strong>

              {branchData && (
                <p className="mt-1 text-small-regular text-gray-500">
                  The {branchData.branch_region} branch of{" "}
                  {branchData.branch_name} has recorded a total of{" "}
                  {branchData.branch_total_packages} package
                  {branchData.branch_total_packages === 1 ? "" : "s"}.
                  <br />
                  Of which {branchData.branch_ready_packages}{" "}
                  {branchData.branch_ready_packages === 1 ? "is" : "are"} ready
                  to ship, {branchData.branch_shipped_packages}{" "}
                  {branchData.branch_shipped_packages === 1 ? "has" : "have"}{" "}
                  been shipped, {branchData.branch_arrived_packages}{" "}
                  {branchData.branch_arrived_packages === 1 ? "has" : "have"}{" "}
                  arrived, and {branchData.branch_delivered_packages}{" "}
                  {branchData.branch_delivered_packages === 1 ? "has" : "have"}{" "}
                  been delivered.
                  <br />
                  Adding up to a total revenue of{" "}
                  <span className="text-gray-600 font-bold">
                    Tsh {branchData.branch_total_revenue.toLocaleString("en")}/=
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PackagesOverview;
