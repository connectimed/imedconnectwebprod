"use client";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
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
import AddReferenceMaterial from "@/components/admin/AddReferenceMaterial";

const ReferenceCardList = ({ data, userData, fetchUserData }) => {
  // Function to hide the post by updating the forum_visibility field
  const hidePost = async (forumId) => {
    try {
      const forumRef = doc(db, "References", forumId);
      await updateDoc(forumRef, { reference_visibility: false });
      console.log("Post hidden:", forumId);

      fetchUserData(userData.user_id);
    } catch (error) {
      console.error("Error hiding post:", error);
    }
  };
  const unhidePost = async (forumId) => {
    try {
      const forumRef = doc(db, "References", forumId);
      await updateDoc(forumRef, { reference_visibility: true });
      console.log("Post hidden:", forumId);

      fetchUserData(userData.user_id);
    } catch (error) {
      console.error("Error hiding post:", error);
    }
  };

  // Function to delete the post from Firestore
  const deletePost = async (forumId) => {
    try {
      const forumRef = doc(db, "References", forumId);
      await deleteDoc(forumRef);
      console.log("Post deleted:", forumId);

      fetchUserData(userData.user_id);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
      {data.map((post) => (
        <div
          key={post.id}
          className="overflow-hidden rounded-xl border border-slate-200 transition"
        >
          <div className="bg-white p-4 sm:p-4">
            <a href="#">
              <h3 className="text-base-mediums text-gray-900">
                {post.reference_title}
              </h3>
            </a>

            <p className="mt-0.5 text-small-regular/relaxed text-gray-600">
              {post.reference_description}
            </p>
            <div className="flex flex-row justify-between mt-2">
              {userData.user_type === "Admin" && (
                <div className="flex flex-row space-x-2">
                  <Image
                    className="h-7 w-7 hover:bg-slate-200 rounded-md p-0.5 hover:cursor-pointer"
                    src="/icons/trash-can.svg"
                    height={200}
                    width={200}
                    alt="arrow icon"
                    onClick={() => deletePost(post.reference_id)}
                  />
                  {post.reference_visibility ? (
                    <div
                      className="flex flex-row border border-slate-300 pl-1.5 pr-4 py-1 space-x-2 items-center rounded-md"
                      onClick={() => hidePost(post.reference_id)}
                      // onClick={submitPost}
                    >
                      <Image
                        className="h-5 w-5 hover:bg-slate-200 rounded-md p-0.5 hover:cursor-pointer"
                        src="/icons/eye-dark-openned.svg"
                        height={200}
                        width={200}
                        alt="arrow icon"
                      />
                      <p className="text-subtle-regular">Visible</p>
                    </div>
                  ) : (
                    <div
                      className="flex flex-row border border-slate-300 pl-1.5 pr-4 py-1 space-x-2 items-center rounded-md"
                      onClick={() => unhidePost(post.reference_id)}
                      // onClick={submitPost}
                    >
                      <Image
                        className="h-5 w-5 hover:bg-slate-200 rounded-md p-0.5 hover:cursor-pointer"
                        src="/icons/eye-dark-closed.svg"
                        height={200}
                        width={200}
                        alt="arrow icon"
                      />
                      <p className="text-subtle-regular">Hidden</p>
                    </div>
                  )}
                </div>
              )}
              <Link
                className="text-small-regular text-white bg-primary-deep-light rounded-md px-4 py-1"
                href={post.reference_url}
                target="_blank"
              >
                Visit Link
              </Link>
            </div>
          </div>
        </div>
      ))}
    </ul>
  );
};

const page = () => {
  const { firebaseUser, fetchUserData, fireLoaded, userData } = UserAuth();
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(true);

  const getModules = async () => {
    const dbInstance = collection(db, "References");
    let q = query(
      dbInstance,
      where("reference_visibility", "==", true),
      orderBy("reference_posted_time", "desc")
    );

    setLoading(true);
    try {
      const data = await getDocs(q);

      const newData = data.docs.map((item) => ({
        ...item.data(),
        id: item.id,
      }));

      setReferences(newData);
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
        <AddReferenceMaterial
          userData={userData}
          fetchUserData={fetchUserData}
        />
      )}

      {loading && (
        <div className="flex flex-col justify-center h-full">
          <RingLoader />
        </div>
      )}
      {!loading && references.length === 0 && (
        <div className="flex flex-col justify-center h-full">
          <EmptyState
            title={"No References Found"}
            desc={
              "Looks like no reference materials have been added. Once they are added they will appear here.."
            }
          />
        </div>
      )}
      {!loading && references.length > 0 && (
        <ReferenceCardList
          data={references}
          userData={userData}
          fetchUserData={fetchUserData}
        />
      )}
    </div>
  );
};

export default page;
