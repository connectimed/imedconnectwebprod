import { calculateAgeAndDob } from "@/lib/actions/calculateAgeAndDob";
import { joinUserIds } from "@/lib/actions/joinUserIds";
import { db } from "@/lib/firebase/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import Image from "next/image";
import React from "react";
import AgeAndDate from "../shared/AgeAndDate";

const AdminAllMentorsDialog = ({ selectedPost, userData, fetchUserData }) => {
  const handleClose = () => {
    // setSelectedPost(null);
    const dialog = document.getElementById("mentors_modal");
    if (dialog) {
      dialog.close();
    }
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, "Users", selectedPost.user_id);
      await updateDoc(userRef, {
        user_profile_setup_step: "8",
        user_verified: true,
      });
      fetchUserData(userData.user_id);

      console.log("updated");
      setLoading(false);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const addToChats = async () => {
    //setup
    // setLoading(true);
    try {
      const joinedIds = joinUserIds([userData.user_id, selectedPost.user_id]);
      const chatHeadRef = doc(
        db,
        "Messaging/MessagingSessions/AllSessions",
        joinedIds
      );

      // Use setDoc to set the data under the specified document ID
      await setDoc(chatHeadRef, {
        //create chat head
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

      console.log("updated");
      // setLoading(false);
    } catch (error) {
      console.error("Error during form submission:", error);
    } finally {
      // setLoading(false);
      handleClose();
    }
  };
  return (
    <div>
      <dialog id="mentors_modal" className="modal">
        <div className="modal-box">
          <div className="flex flex-row justify-center">
            <div className="flex flex-col items-center">
              <div className=" flex w-24 h-24">
                <Image
                  className="w-24 h-24 rounded-full cursor-pointer object-cover border-2 border-primary-light/40"
                  src={selectedPost.user_image}
                  alt="image profile"
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
                  Age, date of birth
                </td>
                <td className="px-3 py-1.5">
                  <AgeAndDate timestamp={selectedPost.user_birth_date} />
                </td>
              </tr>

              <tr className="border-b border-slate-200">
                <td className=" border-e border-neutral-200 px-3 py-1.5">
                  Sex and marital status
                </td>
                <td className="px-3 py-1.5">{`${selectedPost.user_sex}, Unknown`}</td>
              </tr>

              <tr className="border-b border-slate-200">
                <td className=" border-e border-neutral-200 px-3 py-1.5">
                  Location
                </td>
                <td className="px-3 py-1.5">{`${selectedPost.user_location_address}`}</td>
              </tr>

              <tr className="border-b border-slate-200">
                <td className=" border-e border-neutral-200 px-3 py-1.5">
                  Training on coaching and mentorship skills
                </td>
                <td className="px-3 py-1.5">
                  {selectedPost.user_has_mentorship_training}
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className=" border-e border-neutral-200 px-3 py-1.5">
                  Experience in business or career coaching
                </td>
                <td className="px-3 py-1.5">
                  {selectedPost.user_has_mentorship_experience}
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className=" border-e border-neutral-200 px-3 py-1.5">
                  Areas of expertise
                </td>
                <td className="px-3 py-1.5">
                  {selectedPost.user_areas_of_expertise.join(", ")}
                </td>
              </tr>
              <tr>
                <td className=" border-e border-neutral-200 px-3 py-1.5">
                  Highest field of study
                </td>
                <td className="px-3 py-1.5">
                  {selectedPost.user_highest_field_of_study}
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

            {!selectedPost.user_verified ? (
              <button
                className="text-small-regular text-white bg-primary-deep-light rounded-lg px-3 py-1.5"
                onClick={handleApprove}
              >
                <p>Approve</p>
              </button>
            ) : (
              <button
                className=" flex flex-row items-center space-x-2 bg-primary-light rounded-lg py-1.5 px-4"
                onClick={addToChats}
              >
                <Image
                  className="w-5 h-5 object-cover aspect-square"
                  src="/icons/add-chat.svg"
                  alt="chat icon"
                  height={512}
                  width={512}
                />
                <p className="text-small-medium text-white">Add To Chats</p>
              </button>
            )}
          </div>
        </div>
      </dialog>

      {/* <dialog id="student_modal" className="modal">
        <div className="modal-box">
          <div className="flex flex-row justify-center">
            <div className="flex flex-col items-center">
              <div className=" flex w-24 h-24">
                <Image
                  className="w-24 h-24 rounded-full cursor-pointer object-cover border-2 border-primary-light/40"
                  src={selectedPost.user_image}
                  alt="image profile"
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
                  Location
                </td>
                <td className="px-3 py-1.5">{`${selectedPost.user_location_address}`}</td>
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
          

          <div className="flex flex-row items-center justify-end w-full mt-5 space-x-4 ">
            <div className="">
              <button
                className=" text-slate-500 text-small-regular outline-none tracking-wide border rounded-lg px-3 py-1.5"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
            {userData.user_type !== "Student" && (
              <button
                className=" flex flex-row items-center space-x-2 bg-primary-light rounded-lg py-1.5 px-4"
                onClick={addToChats}
              >
                <Image
                  className="w-5 h-5 object-cover aspect-square"
                  src="/icons/add-chat.svg"
                  alt="chat icon"
                  height={512}
                  width={512}
                />
                <p className="text-small-medium text-white">Add To Chats</p>
              </button>
            )}
          </div>
        </div>
      </dialog> */}
    </div>
  );
};

export default AdminAllMentorsDialog;
