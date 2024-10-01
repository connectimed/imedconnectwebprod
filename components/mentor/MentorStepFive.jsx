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

const interests = [
  "Business Development and Entrepreneurship",
  "Early Career Development and Counselling",
  "Both areas",
];

const numbers = [
  "Just one",
  "2 - 5",
  "5 - 10",
  "10 - 20",
  "20 - 50",
  "50 and above",
];

const timings = [
  "Anytime during working hours",
  "Morning on weekdays",
  "Afternoon on weekdays",
  "Evening on weekdays",
  "Morning on weekends",
  "Afternoon on weekends",
  "Evening on weekends",
];

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
  "Other",
];

const MentorStepFive = ({ userData }) => {
  const { fetchUserData, logOut, isLocalhost } = UserAuth();
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
      setError("Please select atleast one area of expertise.");
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
                Tell us your preferences.
              </h1>{" "}
              <p className="mt-1 mb-2 text-gray-1 text-small-regular">
                Select major  areas of interest in coaching and mentorship
              </p>
              <Interests
                options={interests}
                selectedValue={interest}
                onSelect={handleInterestChange}
              />
              <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                Select specific areas  of expertise (Tick all that apply)
              </p>
              <MultipleCheckbox
                options={options}
                selectedValues={expertise}
                onSelect={handleSelectionChange}
              />
              <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                How many mentees can you handle efficiently in a given time?
              </p>
              <Interests
                options={numbers}
                selectedValue={number}
                onSelect={handleNumberChange}
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

export default MentorStepFive;
