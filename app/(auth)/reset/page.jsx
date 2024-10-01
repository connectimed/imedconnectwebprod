"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserAuth } from "@/lib/context/AuthContext";
import Image from "next/image";
import Link from "next/link";

import { auth, db } from "@/lib/firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import ErrorBody from "@/components/shared/ErrorBody";
import RingLoader from "@/components/shared/RingLoader";
import FunderLogo from "@/components/shared/FunderLogo";

const page = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [codeIsSent, setCodeIsSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const { firebaseUser, isLocalhost } = UserAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [digits, setDigits] = useState("");
  const router = useRouter();
  const [otp, setOtp] = useState("");

  const apiEndpoint = isLocalhost
    ? "http://localhost:3000/api/verify"
    : `${process.env.NEXT_PUBLIC_DOMAIN}/api/verify`;

  const generateLinkApiEndpoint = isLocalhost
    ? "http://localhost:3000/api/change-password"
    : `${process.env.NEXT_PUBLIC_DOMAIN}/api/change-password`;

  const handlePhoneNumberChange = (e) => {
    // Only update state if the entered value is numeric
    if (/^\d*$/.test(e.target.value)) {
      setPhoneNumber(e.target.value);
    }
  };

  const handleDigitsChange = (e) => {
    let value = e.target.value;
    setDigits(value);
    if (value.length === 6 && value === otp) {
      setPhoneVerified(true);
      generateResetLink();
    } else if (value.length === 6 && value !== otp) {
      setError("Wrong code");
    } else {
      setError("");
    }
  };

  const generateResetLink = async () => {
    const email = `255${phoneNumber}@gmail.com`;
    try {
      const response = await fetch(generateLinkApiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email: email,
        }),
      });

      if (!response.ok) {
        setLoading(false);
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      console.log(result);
      router.push(result.password_reset_link);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error appropriately
    }
  };

  const generateRandomNumber = () => {
    // Generate a random number with 6 digits
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return randomNumber.toString(); // Convert it to string
  };

  const sendOtp = async () => {
    if (phoneNumber.length < 9) {
      setError("Enter valid phone number!");
    } else {
      setLoading(true);
      setError(null);
      const sixDigits = generateRandomNumber();
      setOtp(sixDigits);
      try {
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_phone: `255${phoneNumber}`,
            otp_code: sixDigits,
          }),
        });

        if (!response.ok) {
          setLoading(false);
          throw new Error("Network response was not ok");
        }

        const result = await response.json();

        console.log(result);
        setCodeIsSent(true);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error appropriately
      }
    }
  };

  if (firebaseUser) router.push("/");

  return (
    <div className="flex w-full h-screen flex-wrap bg-primary-deep-dark">
      <div className="flex w-full h-full flex-col justify-center md:w-1/2 lg:w-1/3">
        <div className="flex flex-col overflow-auto px-6 py-6 sm:px-24 md:px-8 bg-primary-dark h-full md:ml-8 md:my-8 md:rounded-xl md:max-w-sm justify-center">
          <Image
            src="/images/logo_tra.png"
            className="h-16 w-16 mt-6 object-cover"
            height={512}
            width={512}
          />
          <div className="flex flex-row text-small-regular gap-2 font-medium tracking-wider mt-6">
            <p className=" text-white">IMED Connect</p>
            <p className="text-slate-400">|</p>
            <p className="text-slate-400">Reset password</p>
          </div>
          {/* <p className="mt-8 text-white text-heading4-medium tracking-wide">
            Reset password
            <br />
            by entering phone number.
          </p> */}

          <p className="mt-2 text-slate-400 text-small-regular tracking-wide">
            Also available on android and ios.
          </p>

          <div className="mt-6 sm:mx-auto sm:w-full">
            <form
              className="space-y-6 text-base-regular text-slate-800"
              action="#"
              method="POST"
            >
              <div className="relative">
                <span className="absolute inset-y-0 start-0 grid place-content-center px-4 text-white">
                  +255
                </span>
                <input
                  type="text"
                  className="w-full bg-transparent border rounded-md border-gray-300 px-4 py-2 ps-16 text-white outline-slate-300 focus:border-primary-light focus:outline-none placeholder:text-slate-400"
                  placeholder="Phone number"
                  disabled={loading}
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                />
              </div>

              {codeIsSent && (
                <div className="">
                  <input
                    type="text"
                    className="w-full bg-transparent border rounded-md border-gray-300 px-4 py-2 text-white outline-slate-300 focus:border-primary-light focus:outline-none placeholder:text-slate-400"
                    placeholder="Six digits code"
                    value={digits}
                    maxLength={6}
                    disabled={loading}
                    onChange={handleDigitsChange}
                  />
                </div>
              )}

              {!codeIsSent && (
                <div>
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
                      alt="image"
                      width={20}
                    />
                    <p>Send OTP</p>
                  </button>
                </div>
              )}
            </form>

            {error && <ErrorBody error={error} />}

            <p className="mt-6 text-start text-small-regular text-white tracking-wider">
              Ready to continue?{" "}
              <Link
                href="/sign-in"
                className="leading-6 text-primary-deep-light"
              >
                Sign In
              </Link>
            </p>
          </div>
          <FunderLogo />
        </div>
      </div>
      <div className="pointer-events-none hidden select-none bg-primary-deep-dark md:block md:w-1/2 lg:w-2/3">
        <img
          className="h-screen w-full object-contain"
          src="/images/isometric-4.png"
        />
      </div>
    </div>
  );

  return (
    <div className="flex w-full h-screen flex-wrap bg-white">
      <div className="flex w-full h-full flex-col justify-center md:w-1/2 lg:w-1/3">
        {phoneVerified ? (
          // <NewPassword email={`255${phoneNumber}`} />
          <RingLoader />
        ) : (
          <div className="flex flex-col px-6 pt-8 sm:px-24 md:justify-start md:px-8 md:pt-0 lg:px-12">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <Image
                className="mx-auto h-10 w-auto object-cover"
                src="/images/kago-logo.png"
                alt="Your Company"
                width={803}
                height={427}
                priority={true}
              />
              <h2 className="mt-6 text-center text-heading3-bold leading-9 text-gray-900">
                Reset Password
              </h2>
              <p className="text-small-regular text-center mx-auto">
                Enter your phone number, you will receive a six digits code to
                verify the phone number.
              </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form
                className="space-y-6 text-base-regular text-slate-800"
                action="#"
                method="POST"
              >
                <div className="relative">
                  <span className="absolute inset-y-0 start-0 grid place-content-center px-4">
                    +255
                  </span>
                  <input
                    type="text"
                    className="w-full bg-white border rounded-md border-gray-300 px-4 py-1.5 ps-16 "
                    placeholder="Phone number"
                    maxLength={9}
                    pattern="[0-9]*"
                    disabled={loading}
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                  />
                </div>

                {codeIsSent && (
                  <div className="">
                    <input
                      type="text"
                      className="w-full bg-white rounded-md border border-gray-300 px-4 py-1.5 pe-12 text-sm shadow-sm"
                      placeholder="Six digits code"
                      value={digits}
                      maxLength={6}
                      disabled={loading}
                      onChange={handleDigitsChange}
                    />
                  </div>
                )}

                {!codeIsSent && (
                  <div>
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
                        alt="image"
                        width={20}
                      />
                      <p>Send OTP</p>
                    </button>
                  </div>
                )}
              </form>

              {error && <ErrorBody error={error} />}

              <p className="mt-10 text-center text-small-regular text-gray-900 tracking-wide">
                Not a member?{" "}
                <Link href="/register" className="leading-6 text-slate-600">
                  Register
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="pointer-events-none hidden select-none bg-black shadow-2xl md:block md:w-1/2 lg:w-2/3">
        <img
          className="h-screen w-full object-cover opacity-70"
          src="/images/reset.jpg"
        />
      </div>
    </div>
  );
};

export default page;
