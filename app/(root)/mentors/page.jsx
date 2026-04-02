"use client";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase";
import { UserAuth } from "@/lib/context/AuthContext";
import EmptyState from "@/components/shared/EmptyState";
import { Guardian } from "@/components/shared/Guardian";
import Image from "next/image";
import Submitter from "@/components/shared/Submitter";
import TimeAgo from "@/components/shared/TimeAgo";
import calculateTimeAgo from "@/lib/actions/calculateTimeAgo";
import RingLoader from "@/components/shared/RingLoader";
import AgeAndDate from "@/components/shared/AgeAndDate";
import { calculateAgeAndDob } from "@/lib/actions/calculateAgeAndDob";
import GenerateMentorsSheet from "@/components/admin/GenerateMentorsSheet";
import AdminAllMentorsDialog from "@/components/admin/AdminAllMentorsDialog";
import StudentAllMentorsDialog from "@/components/student/StudentAllMentorsDialog";

const MentorsList = ({ data, userData, fetchUserData }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPost) {
      const dialog = document.getElementById("mentors_modal");
      if (dialog) {
        dialog.showModal();
      }
    }
  }, [selectedPost]);

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
      {data.map((post) => (
        <div key={post.id}>
          <div
            className="border border-slate-200 rounded-xl bg-white hover:cursor-pointer py-4 px-4"
            onClick={() => handlePostClick(post)}
          >
            <div className="flex flex-row justify-between">
              <div className="flex flex-row space-x-2">
                <Image
                  className="h-8 w-8 rounded-md"
                  src={post.user_image}
                  height={200}
                  width={200}
                  alt="arrow icon"
                />
                <div>
                  <div className="text-small-regular text-gray-500">
                    {post.user_full_name}
                  </div>

                  <div className="text-tiny-regular text-gray-500 line-clamp-1">
                    {post.user_highest_field_of_study}
                  </div>
                </div>
              </div>
              {!post.user_verified && (
                <span className="relative flex justify-center items-center h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-700"></span>
                </span>
              )}
            </div>

            <p className="mt-2 line-clamp-3 text-small-regular text-gray-500">
              {post.user_bio}
            </p>
            <div className="flex flex-row justify-end text-tiny-regular text-gray-500 mt-1">
              <p>Registered: {calculateTimeAgo(post.user_creation_date)}</p>
            </div>
          </div>
          {selectedPost && userData.user_type === "Admin" && (
            <AdminAllMentorsDialog
              selectedPost={selectedPost}
              userData={userData}
              fetchUserData={fetchUserData}
            />
          )}
          {selectedPost &&
            (userData.user_type === "Student" ||
              userData.user_type === "Entrepreneur") && (
              <StudentAllMentorsDialog
                userData={userData}
                selectedPost={selectedPost}
                setSelectedPost={setSelectedPost}
                fetchUserData={fetchUserData}
              />
            )}
        </div>
      ))}
    </div>
  );
};

const page = () => {
  const { firebaseUser, fetchUserData, fireLoaded, userData } = UserAuth();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMentors = async () => {
    const dbInstance = collection(db, "Users");
    const q1 = query(
      dbInstance,
      where("user_type", "==", "Mentor"),
      where("user_verified", "==", true)
    );
    setLoading(true);
    try {
      const data = await getDocs(q1);

      const newData = data.docs.map((item) => ({
        ...item.data(),
        id: item.id,
      }));

      setMentors(newData);
    } catch (error) {
      console.error("Error fetching Firestore data:", error);
    } finally {
      setLoading(false); // Set loading state after the query completes (whether success or error)
    }
  };

  useEffect(() => {
    if (userData) {
      getMentors();
    }
  }, [userData]);

  const authRedirectComponent = Guardian(userData, firebaseUser, fireLoaded);

  if (authRedirectComponent) {
    return authRedirectComponent;
  }

  return (
    <div className="h-full">
      {loading && (
        <div className="flex flex-col justify-center h-full">
          <RingLoader />
        </div>
      )}
      {!loading && mentors.length === 0 && (
        <div className="flex flex-col justify-center h-full">
          <EmptyState
            title={"No Mentors Found"}
            desc={
              "Looks like there are no new mentors yet. Once new mentors sign up they will appear here."
            }
          />
        </div>
      )}
      {!loading && mentors.length > 0 && (
        <div>
          {userData.user_type === "Admin" && (
            <GenerateMentorsSheet
              userData={userData}
              fetchUserData={fetchUserData}
            />
          )}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search for..."
              className="w-full rounded-md border border-slate-300 py-2.5 px-4 pe-10 text-small-regular text-slate-700"
            />

            <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
              <div className=" flex w-6 h-6">
                <Image
                  className="w-6 h-6 rounded-full cursor-pointer object-cover"
                  src="/icons/search-dark.svg"
                  alt="image profile"
                  height={512}
                  width={512}
                />
              </div>
            </span>
          </div>
          <MentorsList
            data={mentors}
            userData={userData}
            fetchUserData={fetchUserData}
          />
        </div>
      )}
    </div>
  );
};

export default page;
