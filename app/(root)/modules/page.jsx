"use client";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase";
import { UserAuth } from "@/lib/context/AuthContext";
import EmptyState from "@/components/shared/EmptyState";
import { Guardian } from "@/components/shared/Guardian";
import TextButton from "@/components/shared/TextButton";
import Image from "next/image";
import AddModule from "@/components/admin/AddModule";
import Link from "next/link";
import RingLoader from "@/components/shared/RingLoader";

const ModuleCardList = ({ data, userInfo }) => {
  return (
    <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
      {data.map((post) => (
        <Link
          href={`/modules/${post.module_id}`}
          className="overflow-hidden rounded-xl border border-slate-200 transition hover:shadow-lg"
        >
          <Image
            alt="module thumbnail"
            src={post.module_image}
            className="h-56 w-full object-cover"
            height={1080}
            width={1920}
          />

          <div className="bg-white p-4 sm:p-4">
            <a href="#">
              <h3 className="text-base-mediums text-gray-900">
                {post.module_title}
              </h3>
            </a>

            <div className="mt-1 flex flex-row justify-between text-subtle-regular text-slate-400 tracking-wide">
              {/* <div className="flex flex-row">
                <p className="mr-1.5">By: </p>
                <p>{post.module_poster_name}</p>
              </div> */}
              <div className="flex flex-row">
                <p className="mr-1 ">{post.module_topics_count}</p>
                <p className="">
                  {post.module_topics_count === 1 ? "topic" : "topics"}
                </p>
              </div>
            </div>

            <p className="mt-0.5 line-clamp-3 text-small-regular/relaxed text-gray-600">
              {post.module_description}
            </p>
          </div>
        </Link>
        // <ReusablePackageCard key={post.id} post={post} userInfo={userInfo} />
      ))}
    </ul>
  );
};

const page = () => {
  const { firebaseUser, fetchUserData, fireLoaded, userData } = UserAuth();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  const getModules = async () => {
    const dbInstance = collection(db, "Modules");
    let q = query(
      dbInstance,
      // where("module_poster_id", "==", userData.user_id),
      where("module_visibility", "==", true),
      orderBy("module_posted_time", "desc")
    );

    setLoading(true);
    try {
      const data = await getDocs(q);

      const newData = data.docs.map((item) => ({
        ...item.data(),
        id: item.id,
      }));

      setModules(newData);
    } catch (error) {
      console.error("Error fetching Firestore data:", error);
    } finally {
      setLoading(false); // Set loading state after the query completes (whether success or error)
    }
  };

  useEffect(() => {
    if (userData) {
      getModules();
    }
  }, [userData]);

  const authRedirectComponent = Guardian(userData, firebaseUser, fireLoaded);

  if (authRedirectComponent) {
    return authRedirectComponent;
  }

  return (
    <div className="flex flex-col h-full">
      {userData.user_type === "Admin" && (
        <AddModule userData={userData} fetchUserData={fetchUserData} />
      )}

      {loading && (
        <div className="flex flex-col justify-center h-full">
          <RingLoader />
        </div>
      )}
      {!loading && modules.length === 0 && (
        <div className="flex flex-col justify-center h-full">
          <EmptyState
            title={"No Modules Found"}
            desc={
              "Looks like you haven't published any module yet. Press 'Create' to publish your first module."
            }
          />
        </div>
      )}
      {!loading && modules.length > 0 && (
        <ModuleCardList data={modules} userInfo={userData} />
      )}
    </div>
  );
};

export default page;
