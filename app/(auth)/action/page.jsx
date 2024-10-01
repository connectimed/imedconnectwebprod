"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import ErrorBody from "@/components/shared/ErrorBody";
import { auth, db } from "@/lib/firebase/firebase";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import RingLoader from "@/components/shared/RingLoader";

const page = ({ email }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionMode, setActionMode] = useState("");
  const [actionOobCode, setActionOobCode] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [actionApiKey, setActionApiKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [password, setPassword] = useState("");
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(null);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const changePassword = async () => {
    if (password.length < 6) {
      setError("Enter a strong password!");
    } else {
      setLoading(true);
      setError(null);

      try {
        await confirmPasswordReset(auth, actionOobCode, password);
        setLoading(false);
        setSuccess("200");
        setPassword("");
      } catch (error) {
        setError("An error occured!");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Do something here...
    const mode = searchParams.get("mode");
    setActionMode(mode);
    const oobCode = searchParams.get("oobCode");
    setActionOobCode(oobCode);
    const apiKey = searchParams.get("apiKey");
    setActionApiKey(apiKey);
    if (oobCode) {
      verifySession(oobCode);
    }
  }, [searchParams]);

  const verifySession = async (code) => {
    try {
      const email = await verifyPasswordResetCode(auth, code);
      setUserEmail(email.replace(/\D/g, ""));
      console.log("here: ", email);
    } catch (error) {
      setError("Invalid Session");
    }
  };

  if (actionMode !== "resetPassword") {
    return (
      <div className="flex flex-col justify-center h-full">
        <RingLoader />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col px-6 pt-8 sm:px-24 md:justify-start md:px-8 md:pt-0 lg:px-12 mt-32">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            className="mx-auto h-16 w-auto object-cover"
            src="/images/imed-logo.png"
            alt="Your Company"
            width={512}
            height={512}
            priority={true}
          />
          <h2 className="mt-6 text-center text-heading3-bold leading-9 text-gray-900">
            Reset Password
          </h2>
          <p className="text-small-regular text-center mx-auto mt-2">
            Enter your new password for {userEmail}, make it hard to guess but
            easy to remember.
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6 text-base-regular text-slate-800"
            action="#"
            method="POST"
          >
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full bg-white rounded-md border border-gray-300 px-4 py-1.5 pe-12 text-sm shadow-sm"
                placeholder="Password"
                value={password}
                disabled={loading || success}
                onChange={handlePasswordChange}
              />

              <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                <img
                  src={
                    showPassword
                      ? "/assets/eye-closed.svg"
                      : "/assets/eye-open.svg"
                  }
                  className="w-4 h-4 cursor-pointer"
                  onClick={togglePasswordVisibility}
                />
              </span>
            </div>

            <div>
              <button
                type="button"
                onClick={loading || success ? null : changePassword}
                className="simple_btn flex flex-row justify-center items-center gap-3"
                disabled={loading || success}
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
                <p>Submit</p>
              </button>
            </div>
          </form>

          {error && <ErrorBody error={error} />}
          {success && (
            <div className="w-full bg-success-2 text-success-1 text-center text-small-regular px-4 py-3 rounded-md mt-6">
              Password reset successfully. Go to{" "}
              <a href="/sign-in" className="underline">
                login
              </a>
              .
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
