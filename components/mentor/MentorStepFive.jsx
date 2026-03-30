import React, { useEffect, useState } from "react";
import { UserAuth } from "@/lib/context/AuthContext";
import Image from "next/image";
import { auth, db } from "@/lib/firebase/firebase";
import { Timestamp, doc, updateDoc } from "firebase/firestore";
import ProgressIndicator from "../shared/ProgressIndicator";
import ErrorBody from "../shared/ErrorBody";
import TextButton from "../shared/TextButton";
import ChoiceChips from "../shared/ChoiceChips";
import Modal from "../shared/Modal";
import Interests from "./Interests";
import MultipleCheckbox from "../shared/MultipleCheckbox";
import { useLanguage } from "@/lib/context/LanguageContext";

const MentorStepFive = ({ userData }) => {
  const { fetchUserData, logOut, isLocalhost } = UserAuth();
  const { t } = useLanguage();

  const interests = [
    { label: t("interest_business"), value: "Business Development and Entrepreneurship" },
    { label: t("interest_career"),   value: "Early Career Development and Counselling" },
    { label: t("interest_both"),     value: "Both areas" },
  ];

  const numbers = [
    { label: t("mentee_one"),     value: "Just one" },
    { label: t("mentee_2_5"),     value: "2 - 5" },
    { label: t("mentee_5_10"),    value: "5 - 10" },
    { label: t("mentee_10_20"),   value: "10 - 20" },
    { label: t("mentee_20_50"),   value: "20 - 50" },
    { label: t("mentee_50_plus"), value: "50 and above" },
  ];

  const timings = [
    { label: t("timing_anytime"),           value: "Anytime during working hours" },
    { label: t("timing_morning_weekday"),   value: "Morning on weekdays" },
    { label: t("timing_afternoon_weekday"), value: "Afternoon on weekdays" },
    { label: t("timing_evening_weekday"),   value: "Evening on weekdays" },
    { label: t("timing_morning_weekend"),   value: "Morning on weekends" },
    { label: t("timing_afternoon_weekend"), value: "Afternoon on weekends" },
    { label: t("timing_evening_weekend"),   value: "Evening on weekends" },
  ];

  const options = [
    { label: t("expertise_entrepreneurship"), value: "Entrepreneurship development" },
    { label: t("expertise_finance"),          value: "Financial management and literacy" },
    { label: t("expertise_investor"),         value: "Investor readiness" },
    { label: t("expertise_biz_mgmt"),         value: "Business Management Strategy and Governance" },
    { label: t("expertise_biz_model"),        value: "Business Modelling and Design thinking" },
    { label: t("expertise_job_search"),       value: "Job searching skills" },
    { label: t("expertise_marketing"),        value: "Marketing and selling skills" },
    { label: t("expertise_online_gigs"),      value: "Online Gigs and Remote jobs" },
    { label: t("expertise_communication"),    value: "Communication and Relationship building" },
    { label: t("expertise_fundraising"),      value: "Fundraising and resource mobilization" },
    { label: t("expertise_digital"),          value: "Digital Skills" },
    { label: t("expertise_innovation"),       value: "Innovation Management" },
    { label: t("expertise_other"),            value: "Other" },
  ];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [trainingChoice, setTrainingChoice] = useState("");
  const [experienceChoice, setExperienceChoice] = useState("");
  const [expertise, setExpertise] = useState([]);
  const [interest, setInterest] = useState(
    "Business Development and Entrepreneurship"
  );
  const [number, setNumber] = useState("10 - 20");
  const [timing, setTimings] = useState(["Anytime during working hours"]);

  const handleInterestChange = (value) => {
    setInterest(value);
  };

  const handleNumberChange = (value) => {
    setNumber(value);
  };

  const handleTimingsChange = (values) => {
    setTimings(values);
  };

  const handleSelectionChange = (expertise) => {
    setExpertise(expertise);
  };

  const saveData = async () => {
    if (expertise.length < 1) {
      setError(t("mentor_step5_error_expertise"));
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    let maxNumber = 0;

    if (number === "Just one") {
      maxNumber = 1;
    } else if (number === "2 - 5") {
      maxNumber = 5;
    } else if (number === "5 - 10") {
      maxNumber = 10;
    } else if (number === "10 - 20") {
      maxNumber = 20;
    } else if (number === "20 - 50") {
      maxNumber = 50;
    } else {
      maxNumber = 100;
    }

    setLoading(true);
    try {
      const userRef = doc(db, "Users", userData.user_id);
      await updateDoc(userRef, {
        user_profile_setup_step: "6",
        user_areas_of_interest: interest,
        user_areas_of_expertise: expertise,
        user_max_students_mentoring: maxNumber,
        user_available_times: timing,
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
        user_profile_setup_step: "4",
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
              src="/images/preference.png"
              height={626}
              width={626}
              alt="otp image"
            />
          </div>
          <div className="rounded-lg md:rounded-l-none md:rounded-r-lg bg-white">
            <div className="mx-auto max-w-md text-center md:text-start px-6 py-6">
              <ProgressIndicator currentStep={6} />
              <h1 className="text-base-semibold font-bold sm:text-body1-bold text-primary-dark-blue mt-12">
                {t("mentor_step5_heading")}
              </h1>{" "}
              <p className="mt-1 mb-2 text-gray-1 text-small-regular">
                {t("mentor_step5_interest_question")}
              </p>
              <Interests
                options={interests}
                selectedValue={interest}
                onSelect={handleInterestChange}
              />
              <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                {t("mentor_step5_expertise_question")}
              </p>
              <MultipleCheckbox
                options={options}
                selectedValues={expertise}
                onSelect={handleSelectionChange}
              />
              <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                {t("mentor_step5_number_question")}
              </p>
              <Interests
                options={numbers}
                selectedValue={number}
                onSelect={handleNumberChange}
              />
              <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                {t("mentor_step5_timing_question")}
              </p>
              <MultipleCheckbox
                options={timings}
                selectedValues={timing}
                onSelect={handleTimingsChange}
              />
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

export default MentorStepFive;
