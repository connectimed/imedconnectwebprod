import React, { useEffect, useState } from "react";
import { UserAuth } from "@/lib/context/AuthContext";
import Image from "next/image";
import { auth, db } from "@/lib/firebase/firebase";
import { Timestamp, doc, updateDoc } from "firebase/firestore";
import ProgressIndicator from "../shared/ProgressIndicator";
import ErrorBody from "../shared/ErrorBody";
import TextButton from "../shared/TextButton";
import ChoiceChips from "../shared/ChoiceChips";
import { useLanguage } from "@/lib/context/LanguageContext";

const MentorStepFour = ({ userData }) => {
  const { fetchUserData, logOut, isLocalhost } = UserAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [trainingChoice, setTrainingChoice] = useState("");
  const [experienceChoice, setExperienceChoice] = useState("");
  const [trainingDesc, setTrainingDesc] = useState("");
  const [experienceDesc, setExperienceDesc] = useState("");
  const options = [
    "Entrepreneurship development",
    "Financial management and literacy",
    "Investor readiness",
    "Business Management Strategy and Governance",
    "Business Modelling and Design thinking",
    "Job searching skills",
    "Marketing and selling skills",
    "Online Gigs and Remote jobs",
    "Communication and Relationship building",
    "Fundraising and resource mobilization",
    "Digital Skills",
    "Innovation Management",
  ];

  const handleTrainingExplanationChange = (e) => {
    const inputValue = e.target.value.slice(0, 2000);
    setTrainingDesc(inputValue);
  };
  const handleExperienceChange = (e) => {
    const inputValue = e.target.value.slice(0, 2000);
    setExperienceDesc(inputValue);
  };

  const saveData = async () => {
    if (!trainingChoice) {
      setError(t("mentor_step4_error_training"));
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    if (trainingChoice === "Yes" && trainingDesc.length < 1) {
      setError(t("mentor_step4_error_training_detail"));
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    if (!experienceChoice) {
      setError(t("mentor_step4_error_experience"));
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    if (experienceChoice === "Yes" && experienceDesc.length < 1) {
      setError(t("mentor_step4_error_experience_detail"));
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, "Users", userData.user_id);
      await updateDoc(userRef, {
        user_profile_setup_step: "5",
        user_has_mentorship_training: trainingChoice,
        user_mentorship_training_detail: trainingDesc,
        user_has_mentorship_experience: experienceChoice,
        user_mentorship_experience_detail: experienceDesc,
      });
      fetchUserData(userData.user_id);

      console.log("updated");
      setLoading(false);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const backPressed = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, "Users", userData.user_id);
      await updateDoc(userRef, {
        user_profile_setup_step: "3",
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
      <div className="mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="hidden md:flex items-center justify-center rounded-lg md:rounded-r-none md:rounded-l-lg bg-[#e2ecf5]">
            <Image
              className="object-contain rounded-lg p-10"
              src="/images/education.png"
              height={626}
              width={626}
              alt="otp image"
            />
          </div>
          <div className="rounded-lg md:rounded-l-none md:rounded-r-lg bg-white">
            <div className="mx-auto max-w-md text-center md:text-start px-6 py-6">
              <ProgressIndicator currentStep={5} />

              <h1 className="text-base-semibold font-bold sm:text-body1-bold text-primary-dark-blue mt-12">
                {t("mentor_step4_heading")}
              </h1>
              <p className="mt-1 mb-2 text-gray-1 text-small-regular">
                {t("mentor_step4_training_question")}
              </p>
              <div className="">
                <ChoiceChips
                  choices={[
                    { label: t("yes"), value: "Yes" },
                    { label: t("no"),  value: "No" },
                  ]}
                  selectedChoice={trainingChoice}
                  onSelectChoice={setTrainingChoice}
                />
              </div>

              {trainingChoice === "Yes" && (
                <div>
                  <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                    {t("mentor_step4_training_detail_label")}
                  </p>
                  <div className="">
                    <textarea
                      rows={3}
                      className="simple_textinput max-h-32 min-h-24"
                      defaultValue={""}
                      placeholder={t("description_placeholder")}
                      value={trainingDesc}
                      onChange={handleTrainingExplanationChange}
                    />
                  </div>
                </div>
              )}

              <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                {t("mentor_step4_experience_question")}
              </p>
              <div className="">
                <ChoiceChips
                  choices={[
                    { label: t("yes"), value: "Yes" },
                    { label: t("no"),  value: "No" },
                  ]}
                  selectedChoice={experienceChoice}
                  onSelectChoice={setExperienceChoice}
                />
              </div>

              {experienceChoice === "Yes" && (
                <div>
                  <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                    {t("mentor_step4_experience_detail_label")}
                  </p>
                  <div className="">
                    <textarea
                      rows={3}
                      className="simple_textinput max-h-32 min-h-24"
                      defaultValue={""}
                      placeholder={t("description_placeholder")}
                      value={experienceDesc}
                      onChange={handleExperienceChange}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-row space-x-3 mx-auto mt-6">
                <div className="w-full">
                  <button
                    type="button"
                    onClick={loading ? null : backPressed}
                    className="outlined_simple_btn flex flex-row justify-center items-center gap-3"
                    disabled={loading}
                  >
                    <Image
                      src="/icons/circle-chase-primary.svg"
                      className={`h-4 w-4 animate-spin ${
                        loading ? "block" : "hidden"
                      }`}
                      height={20}
                      width={20}
                      alt="image"
                    />
                    <p>{t("back")}</p>
                  </button>
                </div>
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
                <div className="mt-4">
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

export default MentorStepFour;
