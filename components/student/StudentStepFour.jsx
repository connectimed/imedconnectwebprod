import React, { useEffect, useState } from "react";
import { UserAuth } from "@/lib/context/AuthContext";
import Image from "next/image";
import { auth, db } from "@/lib/firebase/firebase";
import { Timestamp, doc, updateDoc } from "firebase/firestore";
import ProgressIndicator from "../shared/ProgressIndicator";
import ErrorBody from "../shared/ErrorBody";
import TextButton from "../shared/TextButton";
import YearInput from "../shared/YearInput";
import SingleOptionDropdown from "../shared/SingleOptionDropdown";
import { useLanguage } from "@/lib/context/LanguageContext";

const educationLevels = [
  "Post Graduate",
  "Bachelor's Degree",
  "Diploma",
  "Certificate",
  "Other",
];

const StudentStepFour = ({ userData }) => {
  const { fetchUserData, logOut, isLocalhost } = UserAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [year, setYear] = useState("");
  const [educationLevel, setEducationLevel] = useState("Degree");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [institution, setInstitution] = useState("");

  const handleEducationLevelChange = (value) => {
    setEducationLevel(value);
  };

  const handleFieldOfStudyChange = (e) => {
    const inputValue = e.target.value.slice(0, 80);
    setFieldOfStudy(inputValue);
  };

  const handleInstitutionChange = (e) => {
    const inputValue = e.target.value.slice(0, 80);
    setInstitution(inputValue);
  };

  const handleYearChange = (year) => {
    console.log("Selected year:", year);
    setYear(year);
  };

  const saveData = async () => {
    if (fieldOfStudy.length < 10) {
      setError(t("student_step4_error_field"));
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    if (institution.length < 2) {
      setError(t("student_step4_error_institution"));
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    if (!year) {
      setError(t("student_step4_error_year"));
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
        user_highest_level_of_education: educationLevel,
        user_highest_institution_name: institution.trim(),
        user_highest_field_of_study: fieldOfStudy.trim(),
        user_highest_graduation_year: year.toString(),
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
            <div className="mx-auto max-w-md px-6 py-6">
              <ProgressIndicator currentStep={5} />

              <h1 className="text-base-semibold font-bold sm:text-body1-bold text-primary-dark-blue mt-12">
                {t("student_step4_heading")}
              </h1>
              <p className="mt-1 mb-2 text-gray-1 text-small-regular">
                {t("student_step4_level_question")}
              </p>
              <SingleOptionDropdown
                label={t("student_step4_level_label")}
                options={educationLevels}
                selectedValue={educationLevel}
                onSelect={handleEducationLevelChange}
              />
              <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                {t("student_step4_course_question")}
              </p>
              <div className="">
                <input
                  type="text"
                  className="simple_textinput"
                  placeholder={t("student_step4_course_placeholder")}
                  value={fieldOfStudy}
                  onChange={handleFieldOfStudyChange}
                />
              </div>

              <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                {t("student_step4_institution_question")}
              </p>
              <div className="">
                <input
                  type="text"
                  className="simple_textinput"
                  placeholder={t("student_step4_institution_placeholder")}
                  value={institution}
                  onChange={handleInstitutionChange}
                />
              </div>

              <p className="mt-6 mb-3 text-gray-1 text-small-regular">
                {t("student_step4_year_question")}
              </p>
              <YearInput onChange={handleYearChange} />
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
                <div className="mt-5">
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

export default StudentStepFour;
