import React, { useEffect, useState } from "react";
import { UserAuth } from "@/lib/context/AuthContext";
import Image from "next/image";
import { auth, db } from "@/lib/firebase/firebase";
import { Timestamp, doc, updateDoc } from "firebase/firestore";
import ProgressIndicator from "../shared/ProgressIndicator";
import ErrorBody from "../shared/ErrorBody";
import TextButton from "../shared/TextButton";
import ChoiceChips from "../shared/ChoiceChips";

const StudentStepThree = ({ userData }) => {
  const { fetchUserData, logOut, isLocalhost } = UserAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [location, setLocation] = useState("");

  const handleLocationChange = (e) => {
    const inputValue = e.target.value.slice(0, 80);
    setLocation(inputValue);
  };

  const saveData = async () => {
    if (!maritalStatus) {
      setError("Please select your marital status");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }
    if (location.length < 10) {
      setError("Please enter a valid location");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, "Users", userData.user_id);
      await updateDoc(userRef, {
        user_profile_setup_step: "4",
        user_marital_status: maritalStatus,
        user_location_address: location,
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
        user_profile_setup_step: "2",
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
              src="/images/loc.png"
              height={626}
              width={626}
              alt="otp image"
            />
          </div>
          <div className="rounded-lg md:rounded-l-none md:rounded-r-lg bg-white">
            <div className="mx-auto max-w-md px-6 py-6">
              <ProgressIndicator currentStep={4} />

              <h1 className="text-base-semibold font-bold sm:text-body1-bold text-primary-dark-blue mt-12">
                Tell us more!
              </h1>

              <p className="mt-1 mb-3 text-gray-1 text-small-regular">
                What is your marital status?
              </p>
              <div className="">
                <ChoiceChips
                  choices={["Single", "Married", "Separated", "Widowed"]}
                  selectedChoice={maritalStatus}
                  onSelectChoice={setMaritalStatus}
                />
              </div>

              <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                Please tell us your location.
              </p>
              <div className="">
                <input
                  type="text"
                  className="simple_textinput"
                  placeholder="Eg: Dar Es Salaam, Kinondoni"
                  value={location}
                  onChange={handleLocationChange}
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
                <div className="mt-4">
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

export default StudentStepThree;
