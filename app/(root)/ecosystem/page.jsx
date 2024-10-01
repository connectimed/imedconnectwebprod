"use client";
import AdminAddBlog from "@/components/admin/AdminAddBlog";
import AllBlogs from "@/components/shared/AllBlogs";
import { Guardian } from "@/components/shared/Guardian";
import { UserAuth } from "@/lib/context/AuthContext";
import React, { useState } from "react";

const page = () => {
  const [activeTab, setActiveTab] = useState("blogs");
  const { authLoading, userData, firebaseUser, fetchUserData, fireLoaded } =
    UserAuth();

  const authRedirectComponent = Guardian(userData, firebaseUser, fireLoaded);

  if (authRedirectComponent) {
    return authRedirectComponent;
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div>
        {userData.user_type === "Admin" && (
          <AdminAddBlog userData={userData} fetchUserData={fetchUserData} />
        )}
        <div className="mt-6">
          <AllBlogs userData={userData} fetchUserData={fetchUserData} />
        </div>
      </div>
    </div>
  );
};

export default page;
