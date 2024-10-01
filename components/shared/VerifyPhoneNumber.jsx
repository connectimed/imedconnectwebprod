"use client";
import React, { useEffect, useState } from "react";
import { UserAuth } from "@/lib/context/AuthContext";
import Image from "next/image";
import { auth, db } from "@/lib/firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import ErrorBody from "../shared/ErrorBody";
import TextButton from "./TextButton";
import ProgressIndicator from "../shared/ProgressIndicator";

const VerifyPhoneNumber = ({ userData }) => {
  const { firebaseUser, fetchUserData, logOut, isLocalhost } = UserAuth();
  const [loading, setLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [error, setError] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);

  const apiEndpoint = isLocalhost
    ? "http://localhost:3000/api/verify"
    : `${process.env.NEXT_PUBLIC_DOMAIN}/api/verify`;

  useEffect(() => {
    let timer = null;

    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [countdown]);

  const handleResendClick = () => {
    if (countdown <= 0) {
      // Handle resend action here
      console.log("Resending...");
      sendOtp();
      setCountdown(60); // Reset the countdown timer
    }
  };

  const handleInputChange = (event) => {
    let newValue = event.target.value;

    // Remove any non-numeric characters from the input value
    newValue = newValue.replace(/\D/g, "");

    // Ensure the input value doesn't exceed 6 characters
    if (newValue.length > 6) {
      newValue = newValue.slice(0, 6);
    }

    setInputValue(newValue);

    if (newValue.length === 6 && newValue === otp) {
      recordUserData(userData.user_id);
    } else if (newValue.length === 6 && newValue !== otp) {
      setError("Wrong code");
      setTimeout(() => {
        setError("");
      }, 2000);
    } else {
      setError("");
    }
  };

  const recordUserData = async (uid) => {
    const userRef = doc(db, "Users", uid);
    // console.log("updated last interaction");
    await updateDoc(userRef, {
      user_phone_verified: true,
    });
    fetchUserData(uid);
  };

  const generateRandomNumber = () => {
    // Generate a random number with 6 digits
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return randomNumber.toString(); // Convert it to string
  };

  const sendOtp = async () => {
    setLoading(true);
    const sixDigits = generateRandomNumber();
    console.log(sixDigits);
    setOtp(sixDigits);
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_phone: userData.user_phone,
          otp_code: sixDigits,
        }),
      });

      if (!response.ok) {
        setLoading(false);
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      console.log(result);
      setIsCodeSent(true);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error appropriately
    }
  };

  return (
    <div>
      <div className="mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="hidden md:flex items-center justify-center rounded-lg md:rounded-r-none md:rounded-l-lg bg-[#e2ecf5]">
            <Image
              className="object-contain rounded-lg p-10"
              src="/images/otp.png"
              height={626}
              width={626}
              alt="otp image"
            />
          </div>
          <div className="rounded-lg md:rounded-l-none md:rounded-r-lg bg-white">
            <div className="mx-auto max-w-md text-center md:text-start px-6 py-6">
              <ProgressIndicator currentStep={1} />

              <h1 className="text-base-semibold font-bold sm:text-body1-bold text-primary-dark-blue mt-16">
                Verify Phone Number!
              </h1>

              {isCodeSent ? (
                <p className="mt-2 text-gray-1 text-small-regular">
                  We have sent a one time code to +{userData.user_phone}. <br />
                  Please fill in the code to continue. If you din't receive the
                  code you can send again in 60 seconds.
                </p>
              ) : (
                <p className="mt-2 text-gray-1 text-small-regular">
                  Secure your account with a quick verification. <br />
                  We'll send a one time code to your phone for added security.
                  Click send code to send the code to +{userData.user_phone}.
                </p>
              )}
              <div className="mx-auto mt-6">
                {isCodeSent ? (
                  <div>
                    <input
                      type="text"
                      placeholder="######"
                      className="w-full text-center bg-white tracking-widest rounded-md border border-slate-300 text-base-regular text-black py-1.5 px-4"
                      value={inputValue}
                      onChange={handleInputChange}
                    />
                    <div className="mt-4 text-small-regular">
                      <p
                        className={` text-small-regular tracking-wide ${
                          countdown <= 0
                            ? "cursor-pointer text-slate-500"
                            : "text-slate-300"
                        }`}
                        onClick={handleResendClick}
                      >
                        {countdown > 0
                          ? `Resend in ${countdown} seconds`
                          : "Click to resend"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    <button
                      type="button"
                      onClick={loading ? null : sendOtp}
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
                      <p>Send Code</p>
                    </button>
                  </div>
                )}
              </div>
              {error && (
                <div className="mt-4">
                  <ErrorBody error={error}></ErrorBody>
                </div>
              )}
              <div className=" mx-auto mt-28">
                <TextButton text={"Log Out"} action={logOut} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPhoneNumber;
