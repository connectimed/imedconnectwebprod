import React, { useEffect, useState } from "react";
import PrimaryButton from "./PrimaryButton";
import { UserAuth } from "@/lib/context/AuthContext";
import Image from "next/image";
import { auth, db } from "@/lib/firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import ProgressIndicator from "../shared/ProgressIndicator";
import ErrorBody from "./ErrorBody";
import TextButton from "../shared/TextButton";
import { useLanguage } from "@/lib/context/LanguageContext";

const AccountDecider = ({ userData }) => {
  const { firebaseUser, fetchUserData, logOut, isLocalhost } = UserAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [error, setError] = useState("");

  const saveData = async () => {
    if (!selectedType) {
      setError(t("account_decider_error"));
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }
    setLoading(true);
    try {
      const userRef = doc(db, "Users", userData.user_id);
      await updateDoc(userRef, {
        user_profile_setup_step: "2",
        user_type: selectedType,
      });
      fetchUserData(userData.user_id);

      console.log("updated");
      setLoading(false);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleSelectType = (type) => {
    if (!loading) {
      setSelectedType(type);
    }
    setError("");
  };

  return (
    <div>
      <div className="mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="hidden md:flex items-center justify-center rounded-lg md:rounded-r-none md:rounded-l-lg bg-[#e2ecf5]">
            <Image
              className="object-contain rounded-lg p-10"
              src="/images/decider.png"
              height={626}
              width={626}
              alt="otp image"
            />
          </div>
          <div className="rounded-lg md:rounded-l-none md:rounded-r-lg bg-white">
            <div className="mx-auto max-w-md px-6 py-6">
              <ProgressIndicator currentStep={2} />

              <h1 className="text-base-semibold font-bold sm:text-body1-bold text-primary-dark-blue mt-10">
                {t("account_decider_heading")}
              </h1>

              <p className="mt-1 mb-4 text-gray-1 text-small-regular">
                {t("account_decider_subtitle")}
              </p>
              <div
                className={`flex flex-row border border-slate-300 rounded-lg py-2 px-3 cursor-pointer ${
                  selectedType === "Student" ? "border-primary-light" : ""
                }`}
                onClick={() => handleSelectType("Student")}
              >
                <div className="">
                  <p className=" text-small-regular font-bold text-black">
                    {t("account_student_title")}
                  </p>
                  <p className=" text-small-regular text-gray-600">
                    {t("account_student_desc")}
                  </p>
                </div>
                <Image
                  className="h-4 w-4"
                  src={
                    selectedType === "Student"
                      ? "/icons/selected.svg"
                      : "/icons/unselected.svg"
                  }
                  height={512}
                  width={512}
                  alt="icon"
                />
              </div>

              <div
                className={`flex flex-row border border-slate-300 rounded-lg py-2 px-3 mt-4 cursor-pointer ${
                  selectedType === "Mentor" ? "border-primary-light" : ""
                }`}
                onClick={() => handleSelectType("Mentor")}
              >
                <div className="">
                  <p className=" text-small-regular font-bold text-black">
                    {t("account_mentor_title")}
                  </p>
                  <p className=" text-small-regular text-gray-600">
                    {t("account_mentor_desc")}
                  </p>
                </div>
                <Image
                  className="h-4 w-4"
                  src={
                    selectedType === "Mentor"
                      ? "/icons/selected.svg"
                      : "/icons/unselected.svg"
                  }
                  height={512}
                  width={512}
                  alt="icon"
                />
              </div>

              <div
                className={`flex flex-row border border-slate-300 rounded-lg py-2 px-3 mt-4 cursor-pointer ${
                  selectedType === "Entrepreneur" ? "border-primary-light" : ""
                }`}
                onClick={() => handleSelectType("Entrepreneur")}
              >
                <div className="">
                  <p className=" text-small-regular font-bold text-black">
                    {t("account_entrepreneur_title")}
                  </p>
                  <p className=" text-small-regular text-gray-600">
                    {t("account_entrepreneur_desc")}
                  </p>
                </div>
                <Image
                  className="h-4 w-4"
                  src={
                    selectedType === "Entrepreneur"
                      ? "/icons/selected.svg"
                      : "/icons/unselected.svg"
                  }
                  height={512}
                  width={512}
                  alt="icon"
                />
              </div>
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
                    <p>{t("next")}</p>
                  </button>
                </div>
              </div>
              {error && (
                <div className="mt-6">
                  <ErrorBody error={error} />
                </div>
              )}
              <div className=" mx-auto mt-10">
                <TextButton text={t("log_out")} action={logOut} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDecider;
