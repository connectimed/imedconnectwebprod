"use client";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
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
import Link from "next/link";
import TimeInput from "@/components/shared/TimeInput";
import DateNavigator from "@/components/shared/DateNavigator";

const LivestreamList = ({ data, userInfo }) => {
  const [copiedId, setCopiedId] = useState(false);
  const copyLink = (post) => {
    navigator.clipboard
      .writeText(
        window.location.protocol +
          "//" +
          window.location.host +
          post.livestream_url
      )
      .then(() => {
        setCopiedId(post.livestream_id);
        setTimeout(() => {
          setCopiedId("");
        }, 3000);
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  return (
    <ul className="space-y-4">
      {data.map((post) => (
        <div
          className="border rounded-xl shadow-sm bg-white py-4 sm:py-6"
          key={post.id}
        >
          <div className="px-4 sm:px-6">
            <p className="text-base-regular font-medium text-gray-700">
              {post.livestream_title}
            </p>
            <p className="mt-1 line-clamp-3 text-subtle-regular text-gray-400">
              Host: {post.livestream_poster_user_name}
            </p>
            <Link
              className="mt-1 line-clamp-3 text-small-regular text-gray-500"
              href={`/livestreams/${post.livestream_id}`}
            >
              {post.livestream_body}
            </Link>
          </div>

          {/* interection */}
          <div className="flex flex-row justify-end px-4 sm:px-6 pt-4 text-subtle-regular text-slate-400 tracking-wide space-x-6">
            {copiedId === post.livestream_id ? (
              <button className=" text-success-1 text-small-regular outline-none tracking-wide border border-success-1 rounded-lg px-6 py-1.5">
                <p>✓ Copied</p>
              </button>
            ) : (
              <button
                className=" text-slate-500 text-small-regular outline-none tracking-wide border rounded-lg px-6 py-1.5"
                onClick={() => copyLink(post)}
              >
                <p>Copy Link</p>
              </button>
            )}
            <Link
              className="text-small-regular cursor-pointer py-1.5 px-6 border rounded-lg bg-primary-light text-white"
              target="_blank"
              href={post.livestream_url}
            >
              <p className="text-center">Join Livestream</p>
            </Link>
          </div>
        </div>
      ))}
    </ul>
  );
};

const page = () => {
  const { firebaseUser, fetchUserData, fireLoaded, userData } = UserAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [livestreams, setLivestreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    console.log("Selected date:", newDate);
    setSelectedDate(newDate);
  };

  const handleTitleChange = (e) => {
    const inputValue = e.target.value.slice(0, 30);
    setTitle(inputValue);
  };

  const handleDescChange = (e) => {
    const inputValue = e.target.value.slice(0, 500);
    setDesc(inputValue);
  };

  const getLivestreams = async () => {
    const dbInstance = collection(db, "Livestreams");
    const q1 = query(
      dbInstance,
      where("livestream_invited_users", "array-contains", userData.user_id),
      orderBy("livestream_start_time", "desc")
    );
    setLoading(true);
    try {
      const data = await getDocs(q1);

      const newData = data.docs.map((item) => ({
        ...item.data(),
        id: item.id,
      }));

      setLivestreams(newData);
    } catch (error) {
      console.error("Error fetching Firestore data:", error);
    } finally {
      setLoading(false); // Set loading state after the query completes (whether success or error)
    }
  };

  useEffect(() => {
    if (userData) {
      getLivestreams();
    }
  }, [userData]);

  const authRedirectComponent = Guardian(userData, firebaseUser, fireLoaded);

  if (authRedirectComponent) {
    return authRedirectComponent;
  }

  const handleClose = () => {
    document.getElementById("livestream").close();
  };

  const submitPost = async (e) => {
    e.preventDefault();

    if (title.length < 10) {
      setError("Title too short.");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    if (desc.length < 30) {
      setError("Description too short.");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    if (hours === "" || minutes === "") {
      setError("Please provide both hours and minutes.");
      setTimeout(() => setError(""), 2000);
      return;
    }

    if (isSubmitting) {
      return;
    }
    document.getElementById("livestream").close();

    try {
      const combinedDateTime = new Date(selectedDate);
      combinedDateTime.setHours(hours);
      combinedDateTime.setMinutes(minutes);
      combinedDateTime.setSeconds(0); // Optional: Reset seconds to 0
      combinedDateTime.setMilliseconds(0);

      const forumsRef = collection(db, "Livestreams");
      const docRef = await addDoc(forumsRef, {
        livestream_title: title.trim(),
        livestream_body: desc.trim(),
        livestream_owner: userData.user_id,
        livestream_created_time: serverTimestamp(),
        livestream_url: "",
        livestream_visible: true,
        livestream_is_public: true,

        // analytics
        livestream_joined_users: [],
        livestream_invited_users: [userData.user_id],
        livestream_left_users: [],
        livestream_removed_users: [],
        livestream_start_time: Timestamp.fromDate(combinedDateTime),
        livestream_end_time: serverTimestamp(),
        livestream_id: "",
        livestream_room_id: "",

        // poster user data
        livestream_poster_full_name: userData.user_full_name,
        livestream_poster_user_name: userData.user_full_name,
        livestream_poster_image_url: userData.user_image,
      });

      const newDocId = docRef.id;

      await setDoc(
        doc(forumsRef, newDocId),
        {
          livestream_id: newDocId,
          livestream_room_id: newDocId,
          livestream_url: `/livestream/${newDocId}?roomID=${newDocId}`,
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error during form submission:", error);
    } finally {
      setIsSubmitting(false);
      setDesc("");
      setTitle("");
      fetchUserData(userData.user_id);
    }
  };

  return (
    <div>
      {isSubmitting && <Submitter />}
      <div className="w-full tracking-wide">
        {userData.user_type === "Studentx" && (
          <div className="flex flex-row justify-between items-center w-full border rounded-xl bg-white px-4 py-3 mb-4">
            <div className="flex flex-row space-x-4 items-center">
              <Image
                className="h-8 w-8"
                src="/icons/livestream-inactive.svg"
                height={200}
                width={200}
                alt="arrow icon"
              />

              <div className="tracking-wide">
                <p className="text-base-medium text-slate-600">Livestream</p>
                <p className="text-small-regular text-slate-400">
                  Create a livestream
                </p>
              </div>
            </div>
            <div>
              <button
                type="button"
                className="bg-primary-light text-white text-base-semibold border rounded-lg px-5 py-1 tracking-wide"
                onClick={() =>
                  document.getElementById("livestream").showModal()
                }
              >
                Create
              </button>
              <dialog id="livestream" className="modal">
                <div className="modal-box text-slate-700">
                  <p className="font-bold text-base-regular">Enter details!</p>
                  <p className="text-small-regular mt-1">
                    Enter the details to create the livestream!
                  </p>
                  <div className="mt-3">
                    <input
                      type="text"
                      autoComplete="full_name"
                      className="simple_textinput"
                      placeholder="Title"
                      value={title}
                      onChange={handleTitleChange}
                    />
                  </div>

                  <div className="mt-4 leading-relaxed ">
                    <textarea
                      rows={3}
                      className="simple_textinput max-h-32 min-h-24"
                      defaultValue={""}
                      placeholder="Description"
                      value={desc}
                      onChange={handleDescChange}
                    />
                  </div>

                  <div className="mt-2 flex flex-col space-y-4">
                    <div>
                      <p className="text-small-regular mb-2">
                        Schedule the livestreaming date
                      </p>
                      <DateNavigator
                        initialDate={selectedDate}
                        onDateChange={handleDateChange}
                      />
                    </div>

                    <div>
                      <p className="text-small-regular mb-2">
                        Set time in 24 hrs format
                      </p>
                      <TimeInput
                        hours={hours}
                        minutes={minutes}
                        onHoursChange={setHours}
                        onMinutesChange={setMinutes}
                      />
                    </div>
                  </div>

                  <div className="w-full">
                    {error && (
                      <div className="bg-red-200 text-red-700 text-center text-small-regular px-4 py-3 rounded-md mb-6 mt-4">
                        {error}
                      </div>
                    )}
                  </div>

                  <div className="modal-action">
                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <div className="flex flex-row justify-end items-center space-x-4">
                        <div className="">
                          <button
                            className=" text-slate-500 text-small-regular outline-none tracking-wide border rounded-lg px-6 py-1.5"
                            onClick={handleClose}
                          >
                            Close
                          </button>
                        </div>
                        <button
                          className="bg-primary-light text-white text-base-semibold border rounded-lg px-5 py-1 tracking-wide"
                          onClick={submitPost}
                        >
                          Create
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </dialog>
            </div>
          </div>
        )}

        {!loading && livestreams.length === 0 ? (
          <EmptyState
            title={"Selection is Empty"}
            desc={
              "There is no items in this selection, please add items to this selection or choose another selection. "
            }
          />
        ) : (
          <LivestreamList data={livestreams} userInfo={userData} />
        )}
      </div>
    </div>
  );
};

export default page;
