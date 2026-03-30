import React, { useEffect, useState } from "react";
import { UserAuth } from "@/lib/context/AuthContext";
import Image from "next/image";
import { auth, db } from "@/lib/firebase/firebase";
import { Timestamp, doc, updateDoc } from "firebase/firestore";
import ProgressIndicator from "../shared/ProgressIndicator";
import ErrorBody from "../shared/ErrorBody";
import TextButton from "../shared/TextButton";
import Interests from "../mentor/Interests";
import ChoiceChips from "../shared/ChoiceChips";
import MultipleChoiceChips from "../shared/MultipleChoiceChips";
import MultipleCheckbox from "../shared/MultipleCheckbox";
import { useLanguage } from "@/lib/context/LanguageContext";

const StudentStepFive = ({ userData }) => {
  const { fetchUserData, logOut, isLocalhost } = UserAuth();
  const { t } = useLanguage();

  const sectors = [
    { label: t("sector_agriculture"), value: "Agriculture, Agribusiness or Agro-processing" },
    { label: t("sector_transport"),   value: "Transport and Logistics" },
    { label: t("sector_tourism"),     value: "Tourism and Hospitality" },
    { label: t("sector_construction"),value: "Construction" },
    { label: t("sector_ict"),         value: "Information and Communication Technology" },
    { label: t("sector_agroforestry"),value: "Agroforestry" },
    { label: t("sector_energy"),      value: "Energy" },
    { label: t("sector_other"),       value: "Other" },
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sector, setSector] = useState("Construction");
  const [device, setDevice] = useState([]);
  const [timing, setTimings] = useState(["Anytime during working hours"]);

  const handleSectorChange = (value) => {
    setSector(value);
  };

  const handleSelectChoice = (updatedChoices) => {
    setDevice(updatedChoices);
  };

  const handleTimingsChange = (values) => {
    setTimings(values);
  };

  const saveData = async () => {
    if (device.length < 1) {
      setError(t("student_step5_error_device"));
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, "Users", userData.user_id);
      await updateDoc(userRef, {
        user_profile_setup_step: "6",
        user_preferred_sector: sector,
        user_devices: device,
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
            <div className="mx-auto max-w-md px-6 py-6">
              <ProgressIndicator currentStep={6} />

              <h1 className="text-base-semibold font-bold sm:text-body1-bold text-primary-dark-blue mt-12">
                {t("student_step5_heading")}
              </h1>
              <p className="mt-1 mb-2 text-gray-1 text-small-regular">
                {t("student_step5_sector_question")}
              </p>
              <Interests
                options={sectors}
                selectedValue={sector}
                onSelect={handleSectorChange}
              />

              <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                {t("student_step5_timing_question")}
              </p>
              <MultipleCheckbox
                options={timings}
                selectedValues={timing}
                onSelect={handleTimingsChange}
              />

              <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                {t("student_step5_device_question")}
              </p>
              <div className="">
                <MultipleChoiceChips
                  choices={[
                    { label: t("device_smartphone"), value: "Smartphone" },
                    { label: t("device_computer"),   value: "Computer" },
                    { label: t("device_tablet"),     value: "Tablet" },
                    { label: t("device_none"),       value: "None" },
                  ]}
                  selectedChoices={device}
                  onSelectChoice={handleSelectChoice}
                />
              </div>

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

export default StudentStepFive;
