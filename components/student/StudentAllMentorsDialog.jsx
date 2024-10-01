import { calculateAgeAndDob } from "@/lib/actions/calculateAgeAndDob";
import { db } from "@/lib/firebase/firebase";
import {
  FieldValue,
  addDoc,
  arrayUnion,
  collection,
  doc,
  increment,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import React, { useState } from "react";

const StudentAllMentorsDialog = ({
  userData,
  selectedPost,
  setSelectedPost,
  fetchUserData,
}) => {
  const [bookedStudents, setBookedStudents] = useState(
    selectedPost.user_mentees_who_booked_me
  );
  const [acceptedStudents, setAcceptedStudents] = useState(
    selectedPost.user_mentees_who_i_accepted
  );

  const handleClose = () => {
    setSelectedPost(null);
    const dialog = document.getElementById("mentors_modal");
    if (dialog) {
      dialog.close();
    }
  };

  const handleBooking = async () => {
    try {
      //update mentor's doc
      const userRef = doc(db, "Users", selectedPost.user_id);
      await updateDoc(userRef, {
        user_mentees_who_booked_me: arrayUnion(userData.user_id),
      });

      //update students's doc
      const studentUserRef = doc(db, "Users", userData.user_id);
      await updateDoc(studentUserRef, {
        user_mentors_i_have_booked: arrayUnion(selectedPost.user_id),
      });
      //send notification
      const notificationRef = collection(
        db,
        `Notifications/system/${selectedPost.user_id}`
      );
      const docRef = await addDoc(notificationRef, {
        notification_title_en: "New Booking",
        notification_body_en: `A student named ${userData.user_full_name} has just booked a mentorship session with you. Please visit the Dashboard tab to review their information.`,
        notification_action: "new-booking",
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
      setBookedStudents([...bookedStudents, userData.user_id]);
      console.log("updated");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
  return (
    <div>
      <dialog id="mentors_modal" className="modal">
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
          <table className="table-auto border border-slate-200 w-full tracking-wide">
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
                  Sex
                </td>
                <td className="px-3 py-1.5">
                  <p>{selectedPost.user_sex}</p>
                </td>
              </tr>

              <tr className="border-b border-slate-200">
                <td className=" border-e border-neutral-200 px-3 py-1.5">
                  Region and district
                </td>
                <td className="px-3 py-1.5">{`${selectedPost.user_region}, ${selectedPost.user_district}`}</td>
              </tr>

              <tr className="border-b border-slate-200">
                <td className=" border-e border-neutral-200 px-3 py-1.5">
                  Achievement
                </td>
                <td className="px-3 py-1.5">
                  {selectedPost.user_highest_field_of_study}
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className=" border-e border-neutral-200 px-3 py-1.5">
                  Space available for booking
                </td>
                <td className="px-3 py-1.5">
                  {selectedPost.user_maximum_mentees -
                    selectedPost.user_mentees_who_i_accepted.length}{" "}
                  out of {selectedPost.user_maximum_mentees} maximum
                </td>
              </tr>
              <tr>
                <td className=" border-e border-neutral-200 px-3 py-1.5">
                  Areas of expertise
                </td>
                <td className="px-3 py-1.5">
                  {selectedPost.user_areas_of_expertise.join(", ")}
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
            {!bookedStudents.includes(userData.user_id) &&
              !acceptedStudents.includes(userData.user_id) && (
                <button
                  className="text-small-regular text-white bg-primary-deep-light rounded-lg px-3 py-1.5"
                  onClick={handleBooking}
                >
                  <p>Book This Mentor</p>
                </button>
              )}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default StudentAllMentorsDialog;
