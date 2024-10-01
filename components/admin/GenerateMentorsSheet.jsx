import React, { useState } from "react";
import TextButton from "../shared/TextButton";
import Image from "next/image";
import Submitter from "../shared/Submitter";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db, storage } from "@/lib/firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import * as XLSX from "xlsx";
import { calculateAgeAndDob } from "@/lib/actions/calculateAgeAndDob";
import calculateFutureDate from "@/lib/actions/calculateFutureDate";
import calculateDateAndTime from "@/lib/actions/calculateDateAndTime";

const GenerateMentorsSheet = ({ userData, fetchUserData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const generate = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      // Fetch users from Firestore
      const q = query(
        collection(db, "Users"),
        where("user_type", "==", "Mentor"),
        where("user_verified", "==", true)
      );
      const querySnapshot = await getDocs(q);

      // Map the fetched data to include only the required fields
      const users = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          "Full Name": data.user_full_name,
          "Account Type": data.user_type,
          Sex: data.user_sex,
          "Age & DOB": calculateAgeAndDob(data.user_birth_date),
          "Phone Number": data.user_phone,
          "Education Level": data.user_highest_level_of_education,
          "Field Of Study": data.user_highest_field_of_study,
          "Mentee Range": data.user_mentee_range,
          Region: data.user_region,
          District: data.user_district,
          "Has Mentorship Experience": data.user_mentorship_interested,
          "Areas Of Interest": data.user_areas_of_interest,
          "Areas Of Expertise": data.user_areas_of_expertise.join(", "),
          Availability: data.user_timing.join(", "),
          "Registered On": calculateDateAndTime(data.user_creation_date),
        };
      });

      // Create a worksheet with the mapped data
      const worksheet = XLSX.utils.json_to_sheet(users);

      // Create a workbook and add the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

      // Create a buffer from the workbook
      const workbookBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      // Create a Blob from the buffer
      const blob = new Blob([workbookBuffer], {
        type: "application/octet-stream",
      });

      // Create a link element
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "mentors.xlsx";
      document.body.appendChild(link);

      // Programmatically click the link to trigger the download
      link.click();

      // Remove the link element
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error during form submission:", error);
      setError("Failed! Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {isSubmitting && <Submitter />}
      <div className="flex flex-row justify-between items-center w-full border rounded-xl bg-white px-4 py-3 mb-4">
        <div className="flex flex-row space-x-2 md:space-x-4 items-center">
          <Image
            className="h-8 w-8"
            src="/icons/spreadsheet-inactive.svg"
            height={200}
            width={200}
            alt="arrow icon"
          />

          <div className="tracking-wide">
            <p className="text-small-medium md:text-base-medium text-slate-600">
              Generate A Spreadsheet
            </p>
            <p className="text-subtle-regular md:text-small-regular text-slate-400">
              Generate a mentors spreadsheet.
            </p>
          </div>
        </div>
        <div>
          <button
            type="button"
            className="bg-primary-light text-white text-small-semibold md:text-base-semibold border rounded-lg px-5 py-1 tracking-wide"
            onClick={generate}
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateMentorsSheet;
