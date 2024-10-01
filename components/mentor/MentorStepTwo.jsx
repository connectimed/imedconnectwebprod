import React, { useEffect, useState } from "react";
import PrimaryButton from "../shared/PrimaryButton";
import { UserAuth } from "@/lib/context/AuthContext";
import Image from "next/image";
import { auth, db } from "@/lib/firebase/firebase";
import { Timestamp, doc, updateDoc } from "firebase/firestore";
import ProgressIndicator from "../shared/ProgressIndicator";
import ErrorBody from "../shared/ErrorBody";
import TextButton from "../shared/TextButton";
import DateInput from "../shared/DateInput";

const MentorStepTwo = ({ userData }) => {
  const { firebaseUser, fetchUserData, logOut, isLocalhost } = UserAuth();
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [error, setError] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const handlePhoneChange = (e) => {
    let inputValue = e.target.value;

    // Remove invalid characters
    if (inputValue.length > 0) {
      // Allow only numbers and plus sign
      inputValue = inputValue.replace(/[^+\d]/g, "");

      // Ensure the plus sign is only at the beginning
      if (inputValue[0] === "+") {
        inputValue = "+" + inputValue.slice(1).replace(/\+/g, "");
      } else {
        inputValue = inputValue.replace(/\+/g, "");
      }
    }

    // Limit the length to 15 characters
    inputValue = inputValue.slice(0, 12);

    setPhoneNumber(inputValue);
  };

  const handleEmailChange = (e) => {
    let inputValue = e.target.value;

    // Remove invalid characters
    inputValue = inputValue.replace(/[^a-zA-Z0-9@._-]/g, "");

    // Limit the length to 80 characters
    inputValue = inputValue.slice(0, 80);

    setEmail(inputValue);
  };

  const saveData = async () => {
    if (!day || !month || !year) {
      setError("Please enter a valid date of birth");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    const dateOfBirth = new Date(year, month - 1, day);
    if (isNaN(dateOfBirth.getTime())) {
      setError("Please enter a valid date of birth");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    if (!selectedType) {
      setError("Please select your sex");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    const phoneNumberRegex = /^\+?[1-9]\d{1,14}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (phoneNumber && !phoneNumberRegex.test(phoneNumber)) {
      setError("Please enter a valid phone number.");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, "Users", userData.user_id);
      await updateDoc(userRef, {
        user_profile_setup_step: "3",
        user_sex: selectedType,
        user_birth_date: Timestamp.fromDate(dateOfBirth),
        user_alternative_phone: phoneNumber,
        user_email: email,
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

  const backPressed = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, "Users", userData.user_id);
      await updateDoc(userRef, {
        user_profile_setup_step: "1",
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
              src="/images/calendar.png"
              height={626}
              width={626}
              alt="otp image"
            />
          </div>
          <div className="rounded-lg md:rounded-l-none md:rounded-r-lg bg-white">
            <div className="mx-auto max-w-md px-6 py-6">
              <ProgressIndicator currentStep={3} />

              <h1 className="text-base-semibold font-bold sm:text-body1-bold text-primary-dark-blue mt-10">
                Tell us about you!
              </h1>

              <p className="mt-1 mb-4 text-gray-1 text-small-regular">
                What is your date of birth?
              </p>
              <DateInput
                day={day}
                month={month}
                year={year}
                onDayChange={setDay}
                onMonthChange={setMonth}
                onYearChange={setYear}
              />
              <p className="mt-4 mb-2 text-gray-1 text-small-regular">
                Please tell us your sex.
              </p>
              <div className="flex flex-row space-x-4">
                <div
                  className={`flex flex-row border border-slate-300 rounded-lg py-2 px-3 cursor-pointer w-full ${
                    selectedType === "Male" ? "border-primary-light" : ""
                  }`}
                  onClick={() => handleSelectType("Male")}
                >
                  <div className="flex flex-row justify-between w-full">
                    <p className=" text-small-regular font-bold text-black">
                      Male
                    </p>
                    <Image
                      className="h-4 w-4"
                      src={
                        selectedType === "Male"
                          ? "/icons/selected.svg"
                          : "/icons/unselected.svg"
                      }
                      height={512}
                      width={512}
                      alt="icon"
                    />
                  </div>
                </div>

                <div
                  className={`flex flex-row border border-slate-300 rounded-lg py-2 px-3 cursor-pointer w-full ${
                    selectedType === "Female" ? "border-primary-light" : ""
                  }`}
                  onClick={() => handleSelectType("Female")}
                >
                  <div className="flex flex-row justify-between w-full">
                    <p className=" text-small-regular font-bold text-black">
                      Female
                    </p>
                    <Image
                      className="h-4 w-4"
                      src={
                        selectedType === "Female"
                          ? "/icons/selected.svg"
                          : "/icons/unselected.svg"
                      }
                      height={512}
                      width={512}
                      alt="icon"
                    />
                  </div>
                </div>
              </div>

              {/* alt start */}

              <p className="mt-4 mb-2 text-gray-1 text-small-regular">
                Your alternative phone number
              </p>
              <div className="">
                <input
                  type="text"
                  className="simple_textinput"
                  placeholder="Eg: 255** *** ***"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                />
              </div>

              <p className="mt-4 mb-2 text-gray-1 text-small-regular">
                Your email address
              </p>
              <div className="">
                <input
                  type="text"
                  className="simple_textinput"
                  placeholder="Email address"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>

              {/* alt end */}

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
                <div className="mt-4">
                  <ErrorBody error={error} />
                </div>
              )}
              <div className=" mx-auto mt-8">
                <TextButton text={"Log Out"} action={logOut} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorStepTwo;
