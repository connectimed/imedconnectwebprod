"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserAuth } from "@/lib/context/AuthContext";
import Image from "next/image";
import Link from "next/link";

import { auth, db } from "@/lib/firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import ErrorBody from "@/components/shared/ErrorBody";
import FunderLogo from "@/components/shared/FunderLogo";

const page = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { firebaseUser } = UserAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;

    // Only update state if the entered value is numeric, its length is 9 or less, and it does not start with 0
    if (
      /^\d*$/.test(value) &&
      value.length <= 9 &&
      (value.length === 0 || value[0] !== "0")
    ) {
      setPhoneNumber(value);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    if (value.length <= 24) {
      setPassword(value);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const email = `255${phoneNumber}@gmail.com`;
    if (phoneNumber.length < 9 || password.length < 6) {
      setError("Please fill everything!");
      setTimeout(() => {
        setError("");
      }, 2000);
    } else {
      setLoading(true);
      setError(null);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          setLoading(false);
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setError("Incorrect credentials!");
          setTimeout(() => {
            setError("");
          }, 2000);
          console.log("Error: ", errorMessage);
          setLoading(false);
        });
    }
  };

  if (firebaseUser) router.push("/");

  return (
    <div className="flex w-full h-screen flex-wrap bg-primary-deep-dark">
      <div className="flex w-full h-full flex-col justify-center md:w-1/2 lg:w-1/3">
        <div className="flex flex-col overflow-auto px-6 py-6 sm:px-24 md:px-8 bg-primary-dark h-full md:ml-8 md:my-8 md:rounded-xl md:max-w-sm justify-center">
          <Image
            src="/images/logo_tra.png"
            className="h-16 w-16 object-cover"
            height={512}
            width={512}
          />
          <div className="flex flex-row text-small-regular gap-2 font-medium tracking-wider mt-6">
            <p className=" text-white">IMED Connect</p>
            <p className="text-slate-400">|</p>
            <p className="text-slate-400">Sign In</p>
          </div>

          {/* <p className="mt-8 text-white text-heading4-medium tracking-wide">
            Welcome back to
            <br />
            our thriving community.
          </p> */}

          <p className="mt-2 text-slate-400 text-small-regular tracking-wide">
            Also available on android and ios.
          </p>

          <div className="mt-6 sm:mx-auto sm:w-full">
            <form
              className="space-y-6 text-base-regular text-slate-800"
              onSubmit={handleSignIn} // Add onSubmit handler
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

              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full py-2 pe-12 !bg-transparent border rounded-md border-gray-300 px-4 text-white outline-slate-300 focus:border-primary-light focus:outline-none placeholder:text-slate-400"
                    placeholder="Password"
                    value={password}
                    disabled={loading}
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
                <div className="flex items-center justify-end mt-2 tracking-wide">
                  <Link
                    href="/reset"
                    className="text-small-regular text-slate-400"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  // onClick={loading ? null : handleSignIn}
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
                  <p>Sign In</p>
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-6">
                <ErrorBody error={error} />
              </div>
            )}

            <p className="mt-6 text-start text-small-regular text-white tracking-wider">
              Not a member?{" "}
              <Link
                href="/register"
                className="leading-6 text-primary-deep-light"
              >
                Register
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
};

export default page;
