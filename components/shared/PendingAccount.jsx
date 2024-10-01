import React, { useState } from "react";
import PrimaryButton from "../shared/PrimaryButton";
import Image from "next/image";
import { UserAuth } from "@/lib/context/AuthContext";
import ProgressIndicator from "../shared/ProgressIndicator";
import TextButton from "./TextButton";
import Submitter from "./Submitter";
import { db, storage } from "@/lib/firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";

const PendingAccount = () => {
  const { firebaseUser, fetchUserData, logOut, userData } = UserAuth();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    try {
      setIsSubmitting(true);

      if (file) {
        // Upload image to Firebase Storage
        const storageRef = ref(storage, `Profiles/2024/${userData.user_id}`);
        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);
        const userRef = doc(db, "Users", userData.user_id);
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
      fetchUserData(userData.user_id);
    }
  };

  const saveData = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, "Users", userData.user_id);
      await updateDoc(userRef, {
        user_profile_setup_step: "7",
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
      {isSubmitting && <Submitter />}
      <div className="mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="hidden md:flex items-center justify-center rounded-lg md:rounded-r-none md:rounded-l-lg bg-[#e2ecf5]">
            <Image
              className="object-contain rounded-lg p-10"
              src="/images/waiting.png"
              height={626}
              width={626}
              alt="otp image"
            />
          </div>
          <div className="rounded-lg md:rounded-l-none md:rounded-r-lg bg-white">
            <div className="mx-auto max-w-md text-center px-6 py-6">
              <ProgressIndicator currentStep={7} />
              <div className="flex flex-row justify-center mt-12">
                <div className=" flex w-16 h-16 md:w-28 md:h-28 rounded-full">
                  <label htmlFor="image-profile">
                    <Image
                      className="w-16 h-16 md:w-28 md:h-28 rounded-full cursor-pointer object-cover border-2 md:border-4 border-slate-300"
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
              </div>

              <h1 className="text-base-semibold font-bold sm:text-body1-bold text-primary-dark-blue mt-4">
                Waiting Approval!
              </h1>
              {userData.user_type == "Student" &&
              userData.user_profile_setup_step !== "8" ? (
                <p className="mt-1 mb-3 text-gray-1 text-small-regular">
                  Thanks for taking the time to fill out your information. While
                  your submission is currently under review. Please take time to
                  complete{" "}
                  <span className="font-bold text-slate-700">
                    Employability & Needs
                  </span>{" "}
                  questions.
                </p>
              ) : (
                <p className="mt-1 mb-3 text-gray-1 text-small-regular">
                  Thanks for taking the time to fill out your information. Your
                  submission is currently under review. Please hang tight while
                  we review and approve the details you provided.
                </p>
              )}

              {userData.user_type === "Student" &&
                userData.user_profile_setup_step !== "8" && (
                  <div className="mx-auto mt-6">
                    <div className="w-full">
                      <button
                        type="button"
                        onClick={loading ? null : saveData}
                        className="simple_btn flex flex-row justify-center items-center gap-3"
                        disabled={loading}
                      >
                        <Image
                          src="/icons/circle-chase.svg"
                          className={`h-4 w-4 animate-spin ${
                            loading ? "block" : "hidden"
                          }`}
                          height={20}
                          width={20}
                          alt="image"
                        />
                        <p>Continue</p>
                      </button>
                    </div>
                  </div>
                )}

              <div className=" mx-auto mt-10">
                <TextButton text={"Log Out"} action={logOut} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingAccount;
