import { db } from "@/lib/firebase/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Submitter from "../shared/Submitter";

const GrantAdministrativeRights = ({ userData, fetchUserData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminNames, setAdminNames] = useState([]);
  const [adminPhones, setAdminPhones] = useState([]);
  const superAdmins = [
    "xQFZesjJMrbPVsV1Z2L2Chr1UDJ2",
    "0gAS8XmIPZQZDyK8aAe9MdAvo3f1",
  ];

  useEffect(() => {
    const fetchAdminNames = async () => {
      try {
        const usersRef = collection(db, "Users");
        const q = query(usersRef, where("user_id", "in", superAdmins));
        const querySnapshot = await getDocs(q);

        const names = querySnapshot.docs.map(
          (doc) => doc.data().user_full_name
        );
        const phones = querySnapshot.docs.map((doc) => doc.data().user_phone);
        setAdminNames(names);
        setAdminPhones(phones);
      } catch (error) {
        console.error("Error fetching admin names:", error);
      }
    };

    fetchAdminNames();
  }, []);

  const handlePhoneChange = (e) => {
    let inputValue = e.target.value;

    // Allow the plus sign only at the beginning and numbers for the rest
    if (inputValue[0] === "+") {
      inputValue = "+" + inputValue.slice(1).replace(/[^0-9]/g, "");
    } else {
      inputValue = inputValue.replace(/[^0-9]/g, "");
    }

    const filteredValue = inputValue.slice(0, 13); // Limit length to 13 characters
    setPhone(filteredValue);
    setSearchedUser(null);
  };

  const handleClose = () => {
    document.getElementById("create_module").close();
  };

  const makeAdmin = async (e) => {
    e.preventDefault();

    if (!searchedUser) {
      setError("Please search user first.");
      setSearchedUser(null);
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      handleClose();

      const userRef = doc(db, "Users", searchedUser.user_id);
      await updateDoc(userRef, {
        user_type: "Admin",
      });
    } catch (error) {
      setIsSubmitting(false);
      setSearchedUser(null);
      setError("Failed! Try again.");
    } finally {
      setSearchedUser(null);
      setIsSubmitting(false);
      setPhone("");
      fetchUserData(userData.user_id);
    }
  };

  const searchUser = async () => {
    setSearchedUser(null);
    // Trim spaces from the phone input
    const trimmedPhone = phone.trim();

    // Check if the phone number is empty
    if (trimmedPhone === "") {
      setSearchedUser(null);
      setError("Enter phone number");
      setPhone(""); // Clear the phone input
      setTimeout(() => {
        setError(""); // Clear the error message after 2 seconds
      }, 2000);
      return;
    }

    if (trimmedPhone.startsWith("+") && trimmedPhone.length !== 13) {
      setSearchedUser(null);
      setError("Enter the phone number with a country code");
      setTimeout(() => {
        setError(""); // Clear the error message after 2 seconds
      }, 2000);
      return;
    }

    if (!trimmedPhone.startsWith("+") && trimmedPhone.length !== 12) {
      setSearchedUser(null);
      setError("Enter the phone number with a country code");
      setTimeout(() => {
        setError(""); // Clear the error message after 2 seconds
      }, 2000);
      return;
    }

    try {
      // Remove the leading + sign if it exists
      const phoneNumberToSearch = trimmedPhone.startsWith("+")
        ? trimmedPhone.slice(1)
        : trimmedPhone;
      const usersRef = collection(db, "Users");
      const q = query(usersRef, where("user_phone", "==", phoneNumberToSearch));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data();
        setSearchedUser(userDoc);
        if (userDoc.user_type === "Admin") {
          setError("User is already an Admin.");
          setIsAdmin(true);
          setTimeout(() => {
            setError("");
            setSearchedUser(null);
            setIsAdmin(false);
          }, 5000);
        }
      } else {
        setSearchedUser(null);
        setError("No user found.");
        setTimeout(() => {
          setError(""); // Clear the error message after 2 seconds
        }, 2000);
      }
    } catch (error) {
      setSearchedUser(null); // Clear user data on error
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      {isSubmitting && <Submitter />}
      <div className="border h-4 w-4 border-primary-deep-light rounded-md">
        <Image
          className="cursor-pointer p-0.5"
          src="/icons/add-person.svg"
          height={200}
          width={200}
          alt="arrow icon"
          onClick={() => document.getElementById("create_module").showModal()}
        />
      </div>
      {/* dialog start */}
      <dialog id="create_module" className="modal">
        {!superAdmins.includes(userData.user_id) ? (
          <div className="modal-box text-slate-700 tracking-wide bg-white">
            <p className="font-bold text-base-regular">Restricted Access</p>
            <p className="text-small-regular">
              This administrative action is exclusively managed by "
              {adminNames[0]} - +{adminPhones[0]}" and "{adminNames[1]}". If you
              need this action to be completed or require any assistance related
              to it, please contact either {adminNames[0]} or {adminNames[1]}{" "}
              for support and guidance. They are the only authorized personnel
              to execute this operation.
            </p>

            <div className="w-full">
              {error && (
                <div className="bg-red-200 text-red-700 text-center text-small-regular px-4 py-3 rounded-md mb-6 mt-4">
                  {error}
                </div>
              )}
            </div>

            <div className="flex flex-row items-center justify-end w-full mt-5 space-x-4 ">
              <div className="">
                <button
                  className=" text-slate-500 text-small-regular outline-none tracking-wide border rounded-lg px-6 py-1.5"
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>
              {searchedUser && !isAdmin && (
                <button
                  className="text-small-regular text-white bg-primary-deep-light rounded-lg px-6 py-1.5"
                  onClick={makeAdmin}
                >
                  <p>Make Admin</p>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="modal-box text-slate-700 tracking-wide bg-white">
            <p className="font-bold text-base-regular">
              Grant Administrative Rights
            </p>
            <p className="text-small-regular">
              Enter the phone number of a user who is already registered to
              grant them administrative rights.
            </p>

            <div className="relative mt-4">
              <input
                type="email"
                id="UserEmail"
                className="end_icon_simple_textinput"
                placeholder="Phone number"
                value={phone}
                onChange={handlePhoneChange}
              />

              <span className=" cursor-pointer absolute inset-y-0 end-0 grid w-10 place-content-center text-gray-500">
                <Image
                  className="h-5 w-5"
                  src="/icons/search-dark.svg"
                  height={512}
                  width={512}
                  alt="search icon"
                  onClick={searchUser}
                />
              </span>
            </div>

            {searchedUser && (
              <div className="mt-4 border border-slate-300 rounded-lg text-small-regular">
                <div className="flex flex-row space-x-2 p-2">
                  <Image
                    className="h-16 w-16 rounded-md"
                    src={searchedUser.user_image}
                    height={512}
                    width={512}
                    alt="user profile"
                    onClick={searchUser}
                  />
                  <div>
                    <p className="text-slate-800 font-bold">
                      {searchedUser.user_full_name}
                    </p>
                    <p className="mt-0.5 text-gray-700 line-clamp-2">
                      {searchedUser.user_bio}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="w-full">
              {error && (
                <div className="bg-red-200 text-red-700 text-center text-small-regular px-4 py-3 rounded-md mb-6 mt-4">
                  {error}
                </div>
              )}
            </div>

            <div className="flex flex-row items-center justify-end w-full mt-5 space-x-4 ">
              <div className="">
                <button
                  className=" text-slate-500 text-small-regular outline-none tracking-wide border rounded-lg px-6 py-1.5"
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>
              {searchedUser && !isAdmin && (
                <button
                  className="text-small-regular text-white bg-primary-deep-light rounded-lg px-6 py-1.5"
                  onClick={makeAdmin}
                >
                  <p>Make Admin</p>
                </button>
              )}
            </div>
          </div>
        )}
      </dialog>

      {/* dialod end */}
    </div>
  );
};

export default GrantAdministrativeRights;
