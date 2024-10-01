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

const timings = [
  "Anytime during working hours",
  "Morning on weekdays",
  "Afternoon on weekdays",
  "Evening on weekdays",
  "Morning on weekends",
  "Afternoon on weekends",
  "Evening on weekends",
];

const sectors = [
  "Agriculture, Agribusiness or Agro-processing",
  "Transport and Logistics",
  "Tourism and Hospitality",
  "Construction",
  "Information and Communication Technology",
  "Agroforestry",
  "Energy",
  "Other",
];

const StudentStepFive = ({ userData }) => {
  const { fetchUserData, logOut, isLocalhost } = UserAuth();
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
      setError("Please select device.");
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
                Tell us your preference.
              </h1>
              <p className="mt-1 mb-2 text-gray-1 text-small-regular">
                Which sector do you prefer to specialize in your career
                endeavors?
              </p>
              <Interests
                options={sectors}
                selectedValue={sector}
                onSelect={handleSectorChange}
              />

              <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                What is your most preferred timing for providing mentorship
                support to the beneficiaries? ( pick option you mostly prefer )
              </p>
              <MultipleCheckbox
                options={timings}
                selectedValues={timing}
                onSelect={handleTimingsChange}
              />

              <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                Which devices do you use to access online information?
              </p>
              <div className="">
                <MultipleChoiceChips
                  choices={["Smartphone", "Computer", "Tablet", "None"]}
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
                    <p>Back</p>
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
                    <p>Next</p>
                  </button>
                </div>
              </div>
              {error && (
                <div className="mt-5">
                  <ErrorBody error={error} />
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

export default StudentStepFive;
