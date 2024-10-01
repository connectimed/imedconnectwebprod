"use client";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
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
import ForumItems from "@/components/shared/ForumItems";
import RingLoader from "@/components/shared/RingLoader";

const page = () => {
  const { firebaseUser, fetchUserData, fireLoaded, userData } = UserAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forumBody, setForumBody] = useState("");

  const handleBodyChange = (e) => {
    const inputValue = e.target.value.slice(0, 10000);
    setForumBody(inputValue);
  };

  const getForums = async () => {
    const dbInstance = collection(db, "Forums");
    const q1 = query(
      dbInstance,
      where("forum_visible", "==", true)
      // where("package_status", "==", "SUBMITTED")
    );
    setLoading(true);
    try {
      const data = await getDocs(q1);

      const newData = data.docs.map((item) => ({
        ...item.data(),
        id: item.id,
      }));

      setForums(newData);
    } catch (error) {
      console.error("Error fetching Firestore data:", error);
    } finally {
      setLoading(false); // Set loading state after the query completes (whether success or error)
    }
  };

  useEffect(() => {
    if (userData) {
      getForums();
    }
  }, [userData]);

  const authRedirectComponent = Guardian(userData, firebaseUser, fireLoaded);

  if (authRedirectComponent) {
    return authRedirectComponent;
  }

  const submitPost = async (e) => {
    e.preventDefault();

    if (!forumBody || isSubmitting) {
      // setError("Please fill everything correctly.");
      return;
    }

    try {
      setIsSubmitting(true);
      // setError(null);

      const forumsRef = collection(db, "Forums");
      const docRef = await addDoc(forumsRef, {
        forum_body: forumBody.trim(),
        forum_owner: userData.user_id,
        forum_posted_time: serverTimestamp(),
        forum_image: "",
        forum_has_image: false,
        forum_image_aspect_ratio: "",
        forum_video: "",
        forum_has_video: false,
        forum_audio: "",
        forum_has_audio: false,
        forum_voice: "",
        forum_has_voice: false,
        forum_visible: true,

        //analytics
        forum_views: 0,
        forum_likes: [],
        forum_unique_views: [],
        forum_inline_users: [],
        forum_bookmarking_users: [],
        forum_clicks_count: 0,
        forum_comments_count: 0,
        forum_ranking: 100,
        forum_id: "",

        ///poster user data
        forum_poster_full_name: userData.user_full_name,
        forum_poster_user_name: userData.user_full_name,
        forum_poster_image_url: userData.user_image,
      });

      const newDocId = docRef.id;

      await setDoc(
        doc(forumsRef, newDocId),
        {
          forum_id: newDocId,
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error during form submission:", error);

      // setError("Imefeli, jaribu tena!.");
    } finally {
      setIsSubmitting(false);
      setForumBody("");
      fetchUserData(userData.user_id);
      // router.push("/");
    }
  };

  return (
    <div className="h-full">
      {isSubmitting && <Submitter />}
      <div className="h-full">
        {userData.user_type === "Admin" && (
          <div className="mb-4 relative">
            <textarea
              rows={3}
              className="w-full rounded-xl border border-slate-300 py-2 ps-4 text-small-regular bg-white max-h-32 min-h-24 pe-16" // Add padding to the right for the button
              placeholder="Tell us your thoughts...."
              value={forumBody}
              onChange={handleBodyChange}
            />
            <button
              type="button"
              className="absolute bottom-4 right-2 bg-primary-light border rounded-lg px-2 py-0"
              onClick={submitPost}
            >
              <Image
                className="h-8 w-8"
                src="/icons/send-arrow.svg"
                height={200}
                width={200}
                alt="arrow icon"
              />
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col justify-center h-full">
            <RingLoader />
          </div>
        )}
        {!loading && forums.length === 0 && (
          <div className="">
            <EmptyState
              title={"Selection is Empty"}
              desc={
                "There is no items in this selection, please add items to this selection or choose another selection. "
              }
            />
          </div>
        )}
        {forums.length > 0 && (
          <ForumItems
            data={forums}
            userData={userData}
            fetchUserData={fetchUserData}
          />
        )}
      </div>
    </div>
  );
};

export default page;
