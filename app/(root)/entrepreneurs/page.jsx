"use client";
import {
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
import calculateTimeAgo from "@/lib/actions/calculateTimeAgo";
import RingLoader from "@/components/shared/RingLoader";
import AgeAndDate from "@/components/shared/AgeAndDate";
import GenerateEntrepreneursSheet from "@/components/admin/GenerateEntrepreneursSheet";
import { joinUserIds } from "@/lib/actions/joinUserIds";

const EntrepreneursList = ({ data, userData, fetchUserData }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPost) {
      const dialog = document.getElementById("entrepreneur_list_modal");
      if (dialog) {
        dialog.showModal();
      }
    }
  }, [selectedPost]);

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const handleClose = () => {
    setSelectedPost(null);
    const dialog = document.getElementById("entrepreneur_list_modal");
    if (dialog) {
      dialog.close();
    }
  };

  const addToChats = async () => {
    setLoading(true);
    try {
      const joinedIds = joinUserIds([userData.user_id, selectedPost.user_id]);
      const chatHeadRef = doc(
        db,
        "Messaging/MessagingSessions/AllSessions",
        joinedIds
      );

      await setDoc(chatHeadRef, {
        session_id: joinedIds,
        session_is_group: false,
        session_group_name: "",
        session_group_profile: "",
        session_last_interaction: serverTimestamp(),
        session_participants_ids: [userData.user_id, selectedPost.user_id],
        session_participants_names: [
          `${userData.user_id}-${userData.user_full_name}`,
          `${selectedPost.user_id}-${selectedPost.user_full_name}`,
        ],
        session_participants_profiles: [
          `${userData.user_id}-${userData.user_image}`,
          `${selectedPost.user_id}-${selectedPost.user_image}`,
        ],
        session_participants_types: [
          `${userData.user_id}-${userData.user_type}`,
          `${selectedPost.user_id}-${selectedPost.user_type}`,
        ],
        session_last_text: "You can now send a message.",
        session_last_text_seen_by: [userData.user_id],
        session_blocked_users: [],
        session_read_only_users: [],
      });
      fetchUserData(userData.user_id);
      setLoading(false);
    } catch (error) {
      console.error("Error during form submission:", error);
    } finally {
      setLoading(false);
    }
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
                  alt="profile"
                />
                <div>
                  <div className="text-small-regular text-gray-500">
                    {post.user_full_name}
                  </div>
                  <div className="text-tiny-regular text-gray-500 line-clamp-1">
                    {post.user_preferred_sector_to_specialize}
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-2 line-clamp-3 text-small-regular text-gray-500">
              {post.user_bio}
            </p>
            <div className="flex flex-row justify-end text-tiny-regular text-gray-500 mt-1">
              <p>Registered: {calculateTimeAgo(post.user_creation_date)}</p>
            </div>
          </div>

          {selectedPost && userData.user_type !== "Student" && (
            <dialog id="entrepreneur_list_modal" className="modal">
              <div className="modal-box">
                <div className="flex flex-row justify-center">
                  <div className="flex flex-col items-center">
                    <div className="flex w-24 h-24">
                      <Image
                        className="w-24 h-24 rounded-full cursor-pointer object-cover border-2 border-primary-light/40"
                        src={selectedPost.user_image}
                        alt="profile"
                        height={512}
                        width={512}
                      />
                    </div>
                    <h4 className="text-slate-800 text-base-medium font-bold mt-2 tracking-wide">
                      {selectedPost.user_full_name}
                    </h4>
                    <p className="text-slate-500 text-tiny-regular font-bold tracking-wide">
                      {selectedPost.user_type} Account
                    </p>
                    <p className="text-subtle-regular text-center mt-2 tracking-wide text-slate-600">
                      {selectedPost.user_bio}
                    </p>
                  </div>
                </div>

                <p className="mt-4 mb-1 text-small-medium">Profile details</p>
                <table className="table-auto border border-slate-200 w-full">
                  <thead className="border-b border-slate-200 text-small-regular">
                    <tr>
                      <th className="border-e border-slate-200 px-3 py-1.5 text-start">
                        Description
                      </th>
                      <th className="px-3 py-1.5 text-start">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-subtle-regular">
                    <tr className="border-b border-slate-200">
                      <td className="border-e border-neutral-200 px-3 py-1.5">
                        Age and date of birth
                      </td>
                      <td className="px-3 py-1.5">
                        <AgeAndDate timestamp={selectedPost.user_birth_date} />
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="border-e border-neutral-200 px-3 py-1.5">
                        Sex
                      </td>
                      <td className="px-3 py-1.5">{selectedPost.user_sex}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="border-e border-neutral-200 px-3 py-1.5">
                        Region
                      </td>
                      <td className="px-3 py-1.5">{selectedPost.user_region}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="border-e border-neutral-200 px-3 py-1.5">
                        District
                      </td>
                      <td className="px-3 py-1.5">{selectedPost.user_district}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="border-e border-neutral-200 px-3 py-1.5">
                        Business name
                      </td>
                      <td className="px-3 py-1.5">
                        {selectedPost.user_highest_institution_name}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="border-e border-neutral-200 px-3 py-1.5">
                        Business sector
                      </td>
                      <td className="px-3 py-1.5">
                        {selectedPost.user_preferred_sector_to_specialize}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="border-e border-neutral-200 px-3 py-1.5">
                        Formalization status
                      </td>
                      <td className="px-3 py-1.5">
                        {selectedPost.user_business_is_formalized}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="border-e border-neutral-200 px-3 py-1.5">
                        Years of operation
                      </td>
                      <td className="px-3 py-1.5">
                        {selectedPost.user_business_started}
                      </td>
                    </tr>
                    <tr>
                      <td className="border-e border-neutral-200 px-3 py-1.5">
                        Phone number
                      </td>
                      <td className="px-3 py-1.5">{selectedPost.user_phone}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex flex-row items-center justify-end w-full mt-5 space-x-4">
                  <button
                    className="text-slate-500 text-small-regular outline-none tracking-wide border rounded-lg px-3 py-1.5"
                    onClick={handleClose}
                  >
                    Close
                  </button>
                  {userData.user_type !== "Student" && (
                    <button
                      className="flex flex-row items-center space-x-2 bg-primary-light rounded-lg py-1.5 px-4"
                      onClick={addToChats}
                    >
                      <Image
                        className="w-5 h-5 object-cover aspect-square"
                        src="/icons/add-chat.svg"
                        alt="chat icon"
                        height={512}
                        width={512}
                      />
                      <p className="text-small-medium text-white">
                        Add To Chats
                      </p>
                    </button>
                  )}
                </div>
              </div>
            </dialog>
          )}
        </div>
      ))}
    </div>
  );
};

const page = () => {
  const { firebaseUser, fetchUserData, fireLoaded, userData } = UserAuth();
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const getEntrepreneurs = async () => {
    const dbInstance = collection(db, "Users");
    const q = query(
      dbInstance,
      where("user_type", "==", "Entrepreneur"),
      where("user_verified", "==", true)
    );
    setLoading(true);
    try {
      const data = await getDocs(q);
      const newData = data.docs.map((item) => ({
        ...item.data(),
        id: item.id,
      }));
      setEntrepreneurs(newData);
    } catch (error) {
      console.error("Error fetching Firestore data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      getEntrepreneurs();
    }
  }, [userData]);

  const filteredEntrepreneurs = entrepreneurs.filter((e) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      e.user_full_name?.toLowerCase().includes(term) ||
      e.user_preferred_sector_to_specialize?.toLowerCase().includes(term)
    );
  });

  const authRedirectComponent = Guardian(userData, firebaseUser, fireLoaded);

  if (authRedirectComponent) {
    return authRedirectComponent;
  }

  return (
    <div className="h-full">
      <div>
        {userData.user_type === "Admin" && (
          <GenerateEntrepreneursSheet
            userData={userData}
            fetchUserData={fetchUserData}
          />
        )}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search for..."
            className="w-full rounded-md border border-slate-300 py-2.5 px-4 pe-10 text-small-regular text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
            <div className="flex w-6 h-6">
              <Image
                className="w-6 h-6 rounded-full cursor-pointer object-cover"
                src="/icons/search-dark.svg"
                alt="search"
                height={512}
                width={512}
              />
            </div>
          </span>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col justify-center mt-32">
          <RingLoader />
        </div>
      )}

      {!loading && filteredEntrepreneurs.length === 0 && (
        <div className="flex flex-col justify-center mt-16">
          <EmptyState
            title={"No Entrepreneurs Found"}
            desc={
              "Looks like there are no registered entrepreneurs yet. Once entrepreneurs sign up and are approved they will appear here."
            }
          />
        </div>
      )}

      {!loading && filteredEntrepreneurs.length > 0 && (
        <EntrepreneursList
          data={filteredEntrepreneurs}
          userData={userData}
          fetchUserData={fetchUserData}
        />
      )}
    </div>
  );
};

export default page;
