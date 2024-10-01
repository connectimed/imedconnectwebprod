import React, { useState } from "react";
import Submitter from "./Submitter";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import ErrorBody from "./ErrorBody";
import Image from "next/image";

const CreateGroupChat = ({ userData, fetchUserData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");

  const handleGroupNameChange = (e) => {
    // Only update state if the entered value contains only letters, spaces, and is within 30 characters
    const inputValue = e.target.value.slice(0, 30); // Limit to 30 characters
    if (/^[A-Za-z\s]*$/.test(inputValue)) {
      setGroupName(inputValue);
    }
  };

  const submitGroup = async (e) => {
    e.preventDefault();

    if (groupName.length < 6) {
      setError("Please enter a longer name.");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const groupRef = collection(
        db,
        "Messaging/MessagingSessions/AllSessions"
      );
      const docRef = await addDoc(groupRef, {
        session_id: "",
        session_is_group: true,
        session_group_name: groupName,
        session_group_profile:
          "https://firebasestorage.googleapis.com/v0/b/imed-connect-staging.appspot.com/o/Placeholders%2Fgroup-profile.jpg?alt=media&token=daaf9c10-9856-40c7-a422-bc338b181b42",
        session_last_interaction: serverTimestamp(),
        session_participants_ids: [userData.user_id],
        session_participants_names: [
          `${userData.user_id}-${userData.user_full_name}`,
        ],
        session_participants_profiles: [
          `${userData.user_id}-${userData.user_image}`,
        ],
        session_participants_types: [
          `${userData.user_id}-${userData.user_type}`,
        ],
        session_last_text: "Be the first to message the group.",
        session_last_text_seen_by: [],
        session_blocked_users: [],
        session_read_only_users: [],
        session_admins: [],
      });

      const newDocId = docRef.id;

      const updateRef = doc(
        db,
        "Messaging/MessagingSessions/AllSessions",
        newDocId
      );
      await updateDoc(updateRef, {
        session_id: newDocId,
      });
    } catch (error) {
      console.error("Error during form submission:", error);
      setIsSubmitting(false);
      setError("Failed! Try again.");
    } finally {
      setIsSubmitting(false);
      fetchUserData(userData.user_id);
      //   router.push("/");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full tracking-wide">
      {isSubmitting && <Submitter />}
      {creating ? (
        <div className="flex flex-col items-center">
          <p className="text-small-regular text-slate-600">Create Group</p>
          <p className="text-heading3-bold text-center mt-1">
            Make A Group To Discuss <br />
            With The Members
          </p>

          <div className="w-72 mt-4">
            <p className="text-small-regular text-slate-500">Group name</p>
            <input
              type="text"
              className="simple_textinput mt-1"
              placeholder="Enter group name"
              value={groupName}
              onChange={handleGroupNameChange}
            />
            <button
              className=" text-small-regular w-full py-2 px-4 border rounded-full bg-primary-light text-white mt-8"
              onClick={submitGroup}
            >
              Create Group
            </button>
            {error && (
              <div className="mt-6">
                <ErrorBody error={error} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          {userData.user_type === "Student" ? (
            <div className="flex flex-col items-center text-small-regular space-y-1">
              <Image
                className="h-10 w-10"
                src="/icons/chat-convo.svg"
                height={512}
                width={512}
                alt="icon"
              />
              <div className=" text-center">
                Select a chat to
                <br />
                open it's conversation.
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-small-regular space-y-1">
              <Image
                className="h-10 w-10"
                src="/icons/chat-convo.svg"
                height={512}
                width={512}
                alt="icon"
              />
              <div className="">Select a chat to open it.</div>
              <div>or</div>
              <div
                className="text-primary-deep-light cursor-pointer"
                onClick={() => {
                  setCreating(true);
                }}
              >
                Create Group
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateGroupChat;
