import { calculateAgeAndDob } from "@/lib/actions/calculateAgeAndDob";
import Image from "next/image";
import React from "react";

const AdminAllMentorsDialog = ({ selectedPost }) => {
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
                  Age, date of birth and sex.
                </td>
                <td className="px-3 py-1.5">
                  <p>{`${calculateAgeAndDob(selectedPost.user_birth_date)} - ${
                    selectedPost.user_sex
                  }`}</p>
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
            {!selectedPost.user_verified && (
              <button
                className="text-small-regular text-white bg-primary-deep-light rounded-lg px-3 py-1.5"
                onClick={handleApprove}
              >
                <p>Approve</p>
              </button>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AdminAllMentorsDialog;
