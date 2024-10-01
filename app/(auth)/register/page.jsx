"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { auth, db } from "@/lib/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import ErrorBody from "@/components/shared/ErrorBody";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import FunderLogo from "@/components/shared/FunderLogo";

const page = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const placeholder =
    "https://firebasestorage.googleapis.com/v0/b/imed-connect.appspot.com/o/Placeholder%2Fuser.jpg?alt=media&token=029c60ae-2118-4616-a309-72e66907a3cd";

  const handlePhoneNumberChange = (e) => {
    // Only update state if the entered value is numeric and is within 9 characters
    const inputValue = e.target.value.slice(0, 9); // Limit to 9 characters
    if (/^\d*$/.test(inputValue)) {
      setPhoneNumber(inputValue);
    }
  };

  const handleUserNameChange = (e) => {
    // Only update state if the entered value contains only letters, spaces, and is within 30 characters
    const inputValue = e.target.value.slice(0, 30); // Limit to 30 characters
    if (/^[A-Za-z\s]*$/.test(inputValue)) {
      setUserName(inputValue);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async () => {
    const email = `255${phoneNumber}@gmail.com`;
    if (userName.trim().length < 4) {
      setError("Enter your full name!");
      setTimeout(() => {
        setError("");
      }, 2000);
    } else if (phoneNumber.length < 9) {
      setError("Enter a valid phone number!");
      setTimeout(() => {
        setError("");
      }, 2000);
    } else if (phoneNumber.startsWith("0")) {
      setError("Phone shouldn't start with 0!");
      setTimeout(() => {
        setError("");
      }, 2000);
    } else if (password.length < 6) {
      setError("Enter a strong password!");
      setTimeout(() => {
        setError("");
      }, 2000);
    } else {
      setLoading(true);
      setError("");
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          if (user) {
            submitUserInfo(user);
          } else {
            setError(`Error creating account`);
          }
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode === "auth/email-already-in-use") {
            setError(`Phone number already in use.`);
          } else {
            setError(`Error! Check and try again.`);
          }
          setTimeout(() => {
            setError("");
          }, 2000);
          setLoading(false);
        });
    }
  };

  const submitUserInfo = async (user) => {
    try {
      const userRef = doc(db, "Users", user.uid);

      // Use setDoc to set the data under the specified document ID
      await setDoc(userRef, {
        // Active
        user_type: "", //Admin //Mentor //Student
        user_full_name: userName.trim(),
        user_phone: `255${phoneNumber}`,
        user_phone_verified: false,
        user_profile_setup_step: "1",
        user_sex: "Male",
        user_birth_date: serverTimestamp(),
        user_marital_status: "",
        user_region: "",
        user_district: "",
        user_highest_level_of_education: "",
        user_highest_field_of_study: "",
        user_highest_institution_name: "",
        user_highest_graduation_year: "",
        user_has_mentorship_training: "No",
        user_mentorship_training_detail: "",
        user_has_mentorship_experience: "No",
        user_mentorship_experience_detail: "",
        user_preferred_sector_to_specialize: "",
        user_alternative_phone: "",
        user_alternative_phone_verified: "",
        user_email: "",
        user_email_verified: false,
        user_devices: [],
        user_mentees_who_booked_me: [],
        user_mentees_who_i_accepted: [],
        user_mentors_i_have_booked: [],
        user_mentors_mentoring_me: [],
        user_areas_of_interest: [],
        user_areas_of_expertise: [],
        user_max_students_mentoring: 10,
        user_available_times: [],
        user_image: placeholder,
        user_preferred_career_pathway: "",
        user_employment_status: "",
        user_owns_business: "",
        user_business_ownership_details: "",
        user_monthly_income: "",
        user_business_plan: "",
        user_business_started: "",
        user_business_start_time: serverTimestamp(),
        user_has_received_support: "",
        user_mentorship_interested: "Yes",
        user_online_timing_availability: "",
        user_has_disability: "",
        user_disability_description: "",
        user_location_address: "",

        // other
        user_password: "",
        user_bio:
          "Hi! I am excited to be a part of IMED Connect. I am here to connect, share, and grow with this vibrant community. Let's collaborate and make the most of this platform together.",
        user_country: "Tanzania",
        user_id: user.uid,
        user_last_interaction: serverTimestamp(),
        user_notification_count: 1,
        user_livestream_count: 0,
        user_forum_count: 0,
        user_exam_count: 0,
        user_message_count: 0,
        user_modules: [],
        user_exams: [],
        user_device_token: "",
        user_creation_date: serverTimestamp(),
        user_language: "en",
        user_verified: false,
        user_otp: "",
        user_current_mo: "",
        user_learning_progress: 0,
        user_modules_completed: 0,
        user_exams_completed: 0,

        //more other
        user_business_is_formalized: "",
        user_business_formalization_level: [],
        user_business_ownership_type: "",
        user_is_seeking_employment: "",
      });
    } catch (error) {
      // Log the actual error
      console.error("Error during form submission:", error);
    } finally {
      setLoading(false);
      router.push("/");
    }
  };

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
            <p className="text-slate-400">Register</p>
          </div>

          {/* <p className="mt-8 text-white text-heading4-medium tracking-wide">
            Become part of
            <br />
            our thriving community.
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
                {/* <span className="absolute inset-y-0 start-1 grid place-content-center px-3">
                  <img src="/icons/office-2.svg" className="w-5 h-5" />
                </span> */}
                <input
                  type="text"
                  className="w-full bg-transparent border rounded-md border-gray-300 px-4 py-2 text-white outline-slate-300 focus:border-primary-light focus:outline-none placeholder:text-slate-400"
                  placeholder="Your name"
                  disabled={loading}
                  value={userName}
                  onChange={handleUserNameChange}
                />
              </div>
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
                {/* <div className="flex items-center justify-end mt-2 tracking-wide">
                  <Link
                    href="/reset"
                    className="text-small-regular text-slate-400"
                  >
                    Forgot password?
                  </Link>
                </div> */}
              </div>

              <div>
                <button
                  type="button"
                  onClick={loading ? null : handleRegister}
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
                  <p>Register Now</p>
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-6">
                <ErrorBody error={error} />
              </div>
            )}

            <p className="mt-6 text-start text-small-regular text-white tracking-wider">
              Already a member?{" "}
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
};

export default page;
