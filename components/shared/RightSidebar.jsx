"use client";
import React from "react";
import { UserAuth } from "@/lib/context/AuthContext";

const RightSidebar = () => {
  const { firebaseUser } = UserAuth();

  if (!firebaseUser) {
    return null;
  }

  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className=" text-body-medium text-dark-3 mb-4">
          Taarifa Na Matangazo
        </h3>
        {/* <Advert /> */}
      </div>
      {/* <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-dark-3">
          Watu waliopendekezwa
        </h3>
      </div> */}
    </section>
  );
};

export default RightSidebar;
