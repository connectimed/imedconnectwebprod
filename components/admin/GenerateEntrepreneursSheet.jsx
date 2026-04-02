import React, { useState } from "react";
import Image from "next/image";
import Submitter from "../shared/Submitter";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import * as XLSX from "xlsx";
import calculateDateAndTime from "@/lib/actions/calculateDateAndTime";
import { calculateAgeAndDob } from "@/lib/actions/calculateAgeAndDob";

const GenerateEntrepreneursSheet = ({ userData, fetchUserData }) => {
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

      const q = query(
        collection(db, "Users"),
        where("user_type", "==", "Entrepreneur"),
        where("user_verified", "==", true)
      );
      const querySnapshot = await getDocs(q);

      const users = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          "Full Name": data.user_full_name,
          "Account Type": data.user_type,
          Sex: data.user_sex,
          "Age & DOB": calculateAgeAndDob(data.user_birth_date),
          "Phone Number": data.user_phone,
          Region: data.user_region,
          District: data.user_district,
          "Business Name": data.user_highest_institution_name,
          "Business Sector": data.user_preferred_sector_to_specialize,
          "Formalization Status": data.user_business_is_formalized,
          "Years of Operation": data.user_business_started,
          "Number of Employees": data.user_business_plan,
          "Monthly Revenue": data.user_monthly_income,
          "Business Challenges": Array.isArray(data.user_areas_of_interest)
            ? data.user_areas_of_interest.join(", ")
            : data.user_areas_of_interest,
          "Has Received Support": data.user_has_received_support,
          "Support Needed": Array.isArray(data.user_available_times)
            ? data.user_available_times.join(", ")
            : data.user_available_times,
          TIN: data.user_current_mo || "Not provided",
          "Registered On": calculateDateAndTime(data.user_creation_date),
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(users);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Entrepreneurs");

      const workbookBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([workbookBuffer], {
        type: "application/octet-stream",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "entrepreneurs.xlsx";
      document.body.appendChild(link);
      link.click();
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
              Generate an entrepreneurs spreadsheet.
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

export default GenerateEntrepreneursSheet;
