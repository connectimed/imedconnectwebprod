import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase";
import Image from "next/image";
import RingLoader from "../shared/RingLoader";
import Link from "next/link";
import EmptyState from "../shared/EmptyState";
import AgeAndDate from "../shared/AgeAndDate";
import ErrorBody from "../shared/ErrorBody";

const UsersList = ({ data, userData, fetchUserData }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPost) {
      const dialog = document.getElementById("my_mentors_modal");
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
    const dialog = document.getElementById("my_mentors_modal");
    if (dialog) {
      dialog.close();
    }
  };

  const handleMessageChange = (e) => {
    const inputValue = e.target.value.slice(0, 350);
    setMessage(inputValue);
  };

  const handleSendMessage = async () => {
    if (!message) {
      setError("Please enter your message.");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }
    //send message
    setLoading(true);

    try {
      // create chat head
      const messagingRef = collection(
        db,
        "Messaging/MessagingSessions/AllSessions"
      );
      const docRef = doc(
        messagingRef,
        `${selectedPost.user_id}_${userData.user_id}`
      );
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        // Update the existing document
        await updateDoc(docRef, {
          session_participants: arrayUnion(userData.user_id),
          session_text_seen_by: arrayUnion(userData.user_id),
          session_last_time: serverTimestamp(),
          session_group_name: "",
          session_last_text: message,
          session_user_one_profile_url: "", //admin
          session_user_one_name: "",
          session_user_two_profile_url: selectedPost.user_image, //mentor
          session_user_two_name: selectedPost.user_full_name,
          session_user_three_profile_url: userData.user_image, //student
          session_user_three_name: userData.user_full_name,
        });
      } else {
        // Create a new document
        await setDoc(docRef, {
          session_id: `${selectedPost.user_id}_${userData.user_id}`,
          session_last_text: message,
          session_last_time: serverTimestamp(),
          session_participants: [userData.user_id],
          session_text_seen_by: [userData.user_id],
          session_is_group: false,
          session_is_visible: true,
          session_group_name: "",
          session_user_one_profile_url: "", //admin
          session_user_one_name: "",
          session_user_two_profile_url: selectedPost.user_image, //mentor
          session_user_two_name: selectedPost.user_full_name,
          session_user_three_profile_url: userData.user_image, //student
          session_user_three_name: userData.user_full_name,
        });
      }

      //send message
      const messagesRef = collection(
        db,
        `Messaging/Messages/${selectedPost.user_id}_${userData.user_id}`
      );
      const msgRef = await addDoc(messagesRef, {
        message_is_image: false,
        message_body: message,
        message_id: "",
        message_image: "",
        message_sender_id: userData.user_id,
        message_sender_name: userData.user_full_name,
        message_seen_by: arrayUnion(userData.user_id),
        message_time: serverTimestamp(),
        message_visibility: true,
        message_type: "message",
        message_quoted_id: "",
        message_quoted_name: "",
        message_quoted_body: "",
      });

      const newDocId = msgRef.id;

      await setDoc(
        doc(messagesRef, newDocId),
        {
          message_id: newDocId,
        },
        { merge: true }
      );
      handleClose();

      console.log("updated");
      setLoading(false);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <div className=" divide-y">
      {data.map((post) => (
        <div key={post.id}>
          <div
            className="flex flex-row items-start w-full py-2.5 px-1.5 hover:bg-slate-200 hover:cursor-pointer text-start space-x-2"
            onClick={() => handlePostClick(post)}
          >
            <Image
              alt="image"
              src={post.user_image}
              height={512}
              width={512}
              className="h-16 w-16 aspect-square rounded-full border-2 border-primary-light/40  object-cover object-center"
            />
            <div>
              <h6 className="text-small-regular font-medium tracking-normal text-slate-700 line-clamp-1">
                {post.user_full_name}
              </h6>
              <p className="text-small-regular antialiased font-normal text-gray-700 line-clamp-2">
                {post.user_bio}
              </p>
            </div>
          </div>
          {selectedPost && (
            <dialog id="my_mentors_modal" className="modal">
              <div className="modal-box">
                <div
                  className="relative mt-1 flex h-48 w-full justify-center rounded-md bg-cover"
                  style={{
                    backgroundImage: 'url("https://picsum.photos/1920/1080")',
                  }}
                >
                  <div className="absolute bottom-0 rounded-md w-full bg-gradient-to-t from-black to-transparent flex flex-row items-end space-x-3 px-2 pb-2">
                    <div className=" flex w-16 h-16 rounded-full">
                      <Image
                        className="w-16 h-16 rounded-full cursor-pointer object-cover border-2 border-white"
                        src={selectedPost.user_image}
                        alt="image profile"
                        height={512}
                        width={512}
                      />
                    </div>
                    <div className="flex flex-col items-start">
                      <h4 className="text-white text-base-medium font-bold tracking-wide">
                        {selectedPost.user_full_name}
                      </h4>
                      <p className="text-white text-small-regular font-bold tracking-wide">
                        {selectedPost.user_type} Account
                      </p>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-base-medium">About me</p>
                <p className="text-small-regular tracking-wide">
                  {selectedPost.user_bio}
                </p>

                {/* table */}
                <p className="mt-4 mb-1 text-base-medium">Profile details</p>
                <table className="table-auto border border-slate-200 w-full">
                  <thead className="border-b border-slate-200 text-small-regular">
                    <tr>
                      <th className="border-e border-slate-200 px-3 py-1.5 text-start">
                        Description
                      </th>
                      <th className=" px-3 py-1.5 text-start">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-subtle-regular">
                    <tr className="border-b border-slate-200">
                      <td className=" border-e border-neutral-200 px-3 py-1.5">
                        Age and date of birth
                      </td>
                      <td className="px-3 py-1.5">
                        <AgeAndDate timestamp={selectedPost.user_birth_date} />
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className=" border-e border-neutral-200 px-3 py-1.5">
                        Sex
                      </td>
                      <td className="px-3 py-1.5">{`${selectedPost.user_sex}`}</td>
                    </tr>

                    <tr className="border-b border-slate-200">
                      <td className=" border-e border-neutral-200 px-3 py-1.5">
                        Region and district
                      </td>
                      <td className="px-3 py-1.5">{`${selectedPost.user_region}, ${selectedPost.user_district}`}</td>
                    </tr>

                    <tr>
                      <td className=" border-e border-neutral-200 px-3 py-1.5">
                        Education
                      </td>
                      <td className="px-3 py-1.5">
                        {selectedPost.user_highest_field_of_study}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {/* table */}

                <div className="mt-4">
                  <textarea
                    rows={3}
                    className="simple_textinput max-h-32 min-h-16"
                    defaultValue={""}
                    placeholder="Your message"
                    value={message}
                    onChange={handleMessageChange}
                  />
                </div>
                {error && (
                  <div className="w-full mt-4">
                    {error && <ErrorBody error={error} />}
                  </div>
                )}

                <div className="flex flex-row items-center justify-end w-full mt-5 space-x-4 ">
                  <div className="">
                    <button
                      className=" text-slate-500 text-small-regular outline-none tracking-wide border rounded-lg px-3 py-1.5"
                      onClick={handleClose}
                    >
                      Close
                    </button>
                  </div>
                  <button
                    className="text-small-regular text-white bg-primary-deep-light rounded-lg px-3 py-1.5"
                    onClick={handleSendMessage}
                  >
                    <p>Send A Message</p>
                  </button>
                </div>
              </div>
            </dialog>
          )}
        </div>
      ))}
    </div>
  );
};

const StudentsMyExams = ({ userData, fetchUserData }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [firstDoc, setFirstDoc] = useState(null);
  const [isFirstPage, setIsFirstPage] = useState(true);

  const getUsers = async (next = true) => {
    const dbInstance = collection(db, `Examinations`);
    let q;
    if (next) {
      q = query(
        dbInstance,
        where("user_type", "==", "Mentor"),
        where(
          "user_mentees_who_i_accepted",
          "array-contains",
          userData.user_id
        ),
        startAfter(lastDoc || 0),
        limit(4)
      );
    } else {
      q = query(
        dbInstance,
        where("user_type", "==", "Mentor"),
        where(
          "user_mentees_who_i_accepted",
          "array-contains",
          userData.user_id
        ),
        limit(4)
      );
    }
    setLoading(true);
    try {
      const data = await getDocs(q);
      const newData = data.docs.map((item) => ({
        ...item.data(),
        id: item.id,
      }));
      setUsers(newData);
      if (data.docs.length > 0) {
        setLastDoc(data.docs[data.docs.length - 1]);
        setFirstDoc(data.docs[0]);
      }
      setIsFirstPage(!next);
    } catch (error) {
      console.error("Error fetching Firestore data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      getUsers(false);
    }
  }, [userData]);

  const handleNext = () => {
    if (!loading && users.length == 4) {
      getUsers(true);
    }
  };

  const handlePrevious = () => {
    if (!loading && !isFirstPage) {
      getUsers(false);
    }
  };

  return (
    <div className="flex flex-col gap-1 px-2 h-full">
      <div className="flex flex-row justify-between border-b pb-1.5  pt-2">
        <p className="pl-2 text-base-regular font-bold tracking-wide">
          My Exams
        </p>
        <div className="flex flex-row space-x-2 pr-2">
          <Image
            className={`h-6 w-6 ${
              loading || isFirstPage ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            src={
              loading || isFirstPage
                ? "/icons/previous-inactive.svg"
                : "/icons/previous-active.svg"
            }
            height={200}
            width={200}
            alt="arrow icon"
            onClick={handlePrevious}
            disabled={loading || isFirstPage}
          />
          <Image
            className={`h-6 w-6 ${
              loading || users.length < 4
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
            src={
              loading || users.length < 4
                ? "/icons/next-inactive.svg"
                : "/icons/next-active.svg"
            }
            height={200}
            width={200}
            alt="arrow icon"
            onClick={handleNext}
            disabled={loading}
          />
        </div>
      </div>

      {loading && (
        <div className="flex flex-col justify-center h-full">
          <RingLoader />
        </div>
      )}
      {!loading && users.length === 0 && (
        <div className="flex flex-col justify-center h-full">
          <EmptyState
            title={"No Examis Found"}
            desc={
              "Looks like you haven't taken any exam. Once you take they will appear here."
            }
          />
        </div>
      )}
      {!loading && users.length > 0 && (
        <UsersList
          data={users}
          userData={userData}
          fetchUserData={fetchUserData}
        />
      )}
    </div>
  );
};

export default StudentsMyExams;
