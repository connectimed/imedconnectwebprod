import { UserAuth } from "@/lib/context/AuthContext";
import { db, storage } from "@/lib/firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import Submitter from "../shared/Submitter";
import Image from "next/image";
import OverviewCard from "../shared/OverviewCard";

const StudentProfile = ({ userData }) => {
  const { firebaseUser, user, fetchUserData } = UserAuth();
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [name, setName] = useState(userData.user_full_name);
  const [bio, setBio] = useState(userData.user_bio);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = (e) => {
    const inputValue = e.target.value.slice(0, 60);
    setName(inputValue);
  };

  const handleBioChange = (e) => {
    const inputValue = e.target.value.slice(0, 250);
    setBio(inputValue);
  };

  const handleClose = () => {
    document.getElementById("update_admin_profile").close();
  };

  const submitPost = async (e) => {
    e.preventDefault();

    if (name.length < 5) {
      setError("Please enter a full name.");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    if (bio.length < 150) {
      setError("Please enter a longer bio.");
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
      handleClose();

      const usersRef = doc(db, "Users", userData.user_id);
      await updateDoc(usersRef, {
        user_full_name: name.trim(),
        user_bio: bio.trim(),
      });
    } catch (error) {
      console.error("Error during form submission:", error);
      setIsSubmitting(false);
      setError("Failed! Try again.");
    } finally {
      setIsSubmitting(false);
      setName("");
      setBio("");
      fetchUserData(userData.user_id);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      updateImage(file);
    }
  };

  const updateImage = async (file) => {
    console.log("here");
    try {
      setIsSubmitting(true);

      if (file) {
        // Upload image to Firebase Storage
        const storageRef = ref(storage, `Profiles/2024/${firebaseUser.uid}`);
        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);
        const userRef = doc(db, "Users", firebaseUser.uid);
        await updateDoc(userRef, {
          user_image: imageUrl,
        });
      } else {
        console.log("there");
      }
    } catch (error) {
      // Log the actual error
      console.error("Error during form submission:", error);
    } finally {
      setIsSubmitting(false);
      fetchUserData(firebaseUser.uid);
    }
  };

  return (
    <div>
      {isSubmitting && <Submitter />}
      <div className="bg-white border rounded-xl relative mx-auto flex h-full w-full flex-col items-center  bg-cover bg-clip-border p-[16px] dark:text-white dark:shadow-none">
        <div
          className="relative mt-1 flex flex-col h-48 w-full justify-between rounded-md bg-cover"
          style={{
            backgroundImage: 'url("https://picsum.photos/1920/1080")',
          }}
        >
          <div className="absolute bottom-0 rounded-md w-full bg-gradient-to-t from-black to-transparent flex flex-row items-end space-x-3 px-2 pb-2">
            <div className=" flex w-16 h-16 md:w-28 md:h-28 rounded-full">
              <label htmlFor="image-profile">
                <Image
                  className="w-16 h-16 md:w-28 md:h-28 rounded-full cursor-pointer object-cover border-2 md:border-4 border-white"
                  src={imagePreview || userData.user_image}
                  alt="image profile"
                  height={512}
                  width={512}
                />
              </label>
              <input
                id="image-profile"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>
            <div className="flex flex-col items-start">
              <div className="flex flex-row items-center space-x-2">
                <h4 className="text-white text-base-medium md:text-heading3-bold font-bold tracking-wide">
                  {userData.user_full_name}
                </h4>
                <div
                  className="rounded-full bg-white w-3 h-3 md:w-4 md:h-4 cursor-pointer"
                  onClick={() =>
                    document.getElementById("update_admin_profile").showModal()
                  }
                >
                  <Image
                    className="p-0.5 md:p-1 object-cover"
                    src="/icons/pencil.svg"
                    alt="image pencil"
                    height={512}
                    width={512}
                  />
                </div>
              </div>
              <p className="text-white text-small-regular md:text-base-regular font-bold tracking-wide">
                Participant Account
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-7 lg:gap-8 w-full">
          <div className="rounded-lg bg-slate-100 md:col-span-3">
            <div className="px-4 py-3 tracking-wide">
              <p className="text-base-medium text-black border-b pb-1.5">
                Overview:
              </p>
              <div className="flex flex-col space-y-2 pt-1.5">
                <OverviewCard
                  text={"Modules"}
                  number={userData.user_modules.length}
                />
                <OverviewCard
                  text={"Forum Posts"}
                  number={userData.user_forum_count}
                />
                <OverviewCard
                  text={"Livestreams"}
                  number={userData.user_livestream_count}
                />
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-slate-100 md:col-span-4">
            <div className="px-4 py-3 tracking-wide">
              <p className="text-base-medium text-black border-b pb-1.5">
                About me:
              </p>
              <p className="text-small-regular mt-1.5">{userData.user_bio}</p>
            </div>
          </div>
        </div>
      </div>
      <dialog id="update_admin_profile" className="modal">
        <div className="modal-box text-slate-700 tracking-wide">
          <p className="font-bold text-base-regular">Update Profile!</p>
          <p className="text-small-regular">
            Kindly provide accurate information for your profile.
          </p>

          <div className="mt-2">
            <input
              type="text"
              className="simple_textinput"
              value={name}
              onChange={handleNameChange}
            />
          </div>

          <div className="mt-4">
            <textarea
              rows={3}
              className="simple_textinput max-h-32 min-h-24"
              placeholder="Your Bio"
              value={bio}
              onChange={handleBioChange}
            />
          </div>

          <div className="w-full">
            {error && (
              <div className="bg-red-200 text-red-700 text-center text-small-regular px-4 py-3 rounded-md mb-6 mt-4">
                {error}
              </div>
            )}
          </div>

          <div className="flex flex-row items-center justify-end w-full mt-5 space-x-4 ">
            <div className="">
              <button
                className=" text-slate-500 text-small-regular outline-none tracking-wide border rounded-lg px-6 py-1.5"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
            <button
              className="text-small-regular text-white bg-primary-deep-light rounded-lg px-6 py-1.5"
              onClick={submitPost}
            >
              <p>Submit</p>
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default StudentProfile;
