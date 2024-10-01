import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
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

const NoticeList = ({ data, userData, fetchUserData }) => {
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    if (selectedPost) {
      const dialog = document.getElementById("booking_modal");
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
    const dialog = document.getElementById("booking_modal");
    if (dialog) {
      dialog.close();
    }
  };

  const handleAccept = async () => {
    // setLoading(true);
    try {
      //update mentor's doc
      const userRef = doc(db, "Users", userData.user_id);
      await updateDoc(userRef, {
        user_mentees_who_i_accepted: arrayUnion(selectedPost.user_id),
        user_mentees_who_booked_me: arrayRemove(selectedPost.user_id),
      });

      //update student's doc
      const studentsUserRef = doc(db, "Users", selectedPost.user_id);
      await updateDoc(studentsUserRef, {
        user_mentors_mentoring_me: arrayUnion(userData.user_id),
        user_mentors_i_have_booked: arrayRemove(userData.user_id),
      });

      //send notification to student
      const notificationRef = collection(
        db,
        `Notifications/system/${selectedPost.user_id}`
      );
      const docRef = await addDoc(notificationRef, {
        notification_title_en: "Booking Accepted",
        notification_body_en: `A mentor named ${userData.user_full_name} has accepted you as their mentee. Stay connected for a more enriching mentorship experience.`,
        notification_action: "booking-accepted",
        notification_destination: "",
        notification_destination_id: "",
        notification_id: "",
        notification_time: serverTimestamp(),
      });

      const newDocId = docRef.id;
      // Update doc
      const updateTopicRef = doc(
        db,
        `Notifications/system/${selectedPost.user_id}`,
        newDocId
      );
      await updateDoc(updateTopicRef, {
        notification_id: newDocId,
      });
      fetchUserData(userData.user_id);

      console.log("updated");
      // setLoading(false);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <div className=" divide-y">
      {data.map((post) => (
        <div>
          <div
            className="flex flex-row items-start w-full py-2.5 px-1.5 hover:bg-slate-200 hover:cursor-pointer text-start space-x-2"
            onClick={() => handlePostClick(post)}
          >
            <Image
              alt="image"
              src={post.user_image}
              height={512}
              width={512}
              className="h-14 w-14 rounded-full  object-cover object-center"
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
            <dialog id="booking_modal" className="modal">
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
                        Sex and marital status
                      </td>
                      <td className="px-3 py-1.5">{`${selectedPost.user_sex}, ${selectedPost.user_marital_status}`}</td>
                    </tr>

                    <tr className="border-b border-slate-200">
                      <td className=" border-e border-neutral-200 px-3 py-1.5">
                        Region and district
                      </td>
                      <td className="px-3 py-1.5">{`${selectedPost.user_region}, ${selectedPost.user_district}`}</td>
                    </tr>

                    <tr className="border-b border-slate-200">
                      <td className=" border-e border-neutral-200 px-3 py-1.5">
                        Highest institution
                      </td>
                      <td className="px-3 py-1.5">
                        {selectedPost.user_highest_institution_name}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className=" border-e border-neutral-200 px-3 py-1.5">
                        Highest field of study
                      </td>
                      <td className="px-3 py-1.5">
                        {selectedPost.user_highest_field_of_study}
                      </td>
                    </tr>

                    <tr>
                      <td className=" border-e border-neutral-200 px-3 py-1.5">
                        Graduation year
                      </td>
                      <td className="px-3 py-1.5">
                        {selectedPost.user_highest_graduation_year}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {/* table */}

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
                    onClick={handleAccept}
                  >
                    <p>Accept Student</p>
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

const MentorBookingStudents = ({ userData, fetchUserData }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [firstDoc, setFirstDoc] = useState(null);
  const [isFirstPage, setIsFirstPage] = useState(true);

  const getStudents = async (next = true) => {
    const dbInstance = collection(db, `Users`);
    let q;
    if (next) {
      q = query(
        dbInstance,
        where("user_type", "==", "Student"),
        where("user_mentors_i_have_booked", "array-contains", userData.user_id),
        startAfter(lastDoc || 0),
        limit(4)
      );
    } else {
      q = query(
        dbInstance,
        where("user_type", "==", "Student"),
        where("user_mentors_i_have_booked", "array-contains", userData.user_id),
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
      setModules(newData);
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
      getStudents(false);
    }
  }, [userData]);

  const handleNext = () => {
    if (!loading && modules.length == 4) {
      getStudents(true);
    }
  };

  const handlePrevious = () => {
    if (!loading && !isFirstPage) {
      getStudents(false);
    }
  };

  return (
    <div className="flex flex-col gap-1 px-2 h-full">
      <div className="flex flex-row justify-between border-b pb-1.5  pt-2">
        <p className="pl-2 text-base-regular font-bold tracking-wide">
          Students Booking You
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
              loading || modules.length < 4
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
            src={
              loading || modules.length < 4
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
      {!loading && modules.length === 0 ? (
        <div className="flex flex-col justify-center h-full">
          <EmptyState
            title={"No Bookings Found"}
            desc={
              "Looks like you haven't been booked yet. Once a students books you, they will appear here."
            }
          />
        </div>
      ) : (
        <NoticeList
          data={modules}
          userData={userData}
          fetchUserData={fetchUserData}
        />
      )}
    </div>
  );
};

export default MentorBookingStudents;
