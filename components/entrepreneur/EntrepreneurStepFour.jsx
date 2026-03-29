import React, { useState } from "react";
import { UserAuth } from "@/lib/context/AuthContext";
import Image from "next/image";
import { db } from "@/lib/firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import ErrorBody from "../shared/ErrorBody";
import TextButton from "../shared/TextButton";
import ChoiceChips from "../shared/ChoiceChips";
import MultipleCheckbox from "../shared/MultipleCheckbox";
import SingleOptionDropdown from "../shared/SingleOptionDropdown";

const revenueRanges = [
  "Below TZS 500,000",
  "TZS 500,001 – 2,000,000",
  "TZS 2,000,001 – 5,000,000",
  "Above TZS 5,000,000",
];

const challengeOptions = [
  "Access to finance",
  "Markets",
  "Skills",
  "Technology",
  "Regulations",
  "Climate change",
  "Other",
];

const supportOptions = [
  "Business training",
  "Mentorship",
  "Market linkages",
  "Access to finance",
  "Networking",
  "Other",
];

const EntrepreneurStepFour = ({ userData }) => {
  const { fetchUserData, logOut } = UserAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [employees, setEmployees] = useState("");
  const [revenue, setRevenue] = useState("Below TZS 500,000");
  const [challenges, setChallenges] = useState([]);
  const [receivedSupport, setReceivedSupport] = useState("");
  const [supportOrg, setSupportOrg] = useState("");
  const [supportNeeded, setSupportNeeded] = useState([]);
  const [tin, setTin] = useState("");
  const [disability, setDisability] = useState("");
  const [disabilityDesc, setDisabilityDesc] = useState("");

  const handleEmployeesChange = (e) => {
    setEmployees(e.target.value.slice(0, 20));
  };

  const handleSupportOrgChange = (e) => {
    setSupportOrg(e.target.value.slice(0, 200));
  };

  const handleTinChange = (e) => {
    setTin(e.target.value.slice(0, 50));
  };

  const handleDisabilityDescChange = (e) => {
    setDisabilityDesc(e.target.value.slice(0, 300));
  };

  const saveData = async () => {
    if (!employees.trim()) {
      setError("Please enter the number of employees.");
      setTimeout(() => setError(""), 2000);
      return;
    }
    if (challenges.length < 1) {
      setError("Please select at least one main challenge.");
      setTimeout(() => setError(""), 2000);
      return;
    }
    if (!receivedSupport) {
      setError("Please indicate whether you have received business support before.");
      setTimeout(() => setError(""), 2000);
      return;
    }
    if (receivedSupport === "Yes" && !supportOrg.trim()) {
      setError("Please name the organisation or project that provided support.");
      setTimeout(() => setError(""), 2000);
      return;
    }
    if (supportNeeded.length < 1) {
      setError("Please select at least one type of support you are looking for.");
      setTimeout(() => setError(""), 2000);
      return;
    }
    if (!disability) {
      setError("Please indicate whether you have any form of disability.");
      setTimeout(() => setError(""), 2000);
      return;
    }
    if (disability === "Yes" && !disabilityDesc.trim()) {
      setError("Please describe your disability.");
      setTimeout(() => setError(""), 2000);
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, "Users", userData.user_id);
      await updateDoc(userRef, {
        user_profile_setup_step: "6",
        user_business_plan: employees.trim(),
        user_monthly_income: revenue,
        user_areas_of_interest: challenges,
        user_has_received_support: receivedSupport,
        user_mentorship_training_detail: supportOrg.trim(),
        user_available_times: supportNeeded,
        user_current_mo: tin.trim(),
        user_has_disability: disability,
        user_disability_description: disabilityDesc.trim(),
      });
      fetchUserData(userData.user_id);
      setLoading(false);
    } catch (err) {
      console.error("Error updating data:", err);
      setError("Something went wrong. Please try again.");
      setTimeout(() => setError(""), 3000);
      setLoading(false);
    }
  };

  const backPressed = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, "Users", userData.user_id);
      await updateDoc(userRef, { user_profile_setup_step: "3" });
      fetchUserData(userData.user_id);
      setLoading(false);
    } catch (err) {
      console.error("Error updating data:", err);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mx-auto bg-white rounded-lg pt-4 pb-10">
        <p className="text-heading3-bold px-6">Your Business Details</p>
        <p className="text-small-regular text-gray-1 px-6">
          This information helps us tailor support and resources to your specific needs.
          All information remains confidential.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 mt-4">
          <div className="flex flex-col px-6">
            <p className="mt-1 mb-2 text-gray-1 text-small-regular">
              Number of employees (including yourself)
            </p>
            <input
              type="text"
              className="simple_textinput"
              placeholder="Eg: 3"
              value={employees}
              onChange={handleEmployeesChange}
            />

            <p className="mt-5 mb-2 text-gray-1 text-small-regular">
              Average monthly revenue (in TZS)
            </p>
            <SingleOptionDropdown
              options={revenueRanges}
              selectedValue={revenue}
              onSelect={setRevenue}
            />

            <p className="mt-5 mb-2 text-gray-1 text-small-regular">
              Main challenges currently facing your business (select all that apply)
            </p>
            <MultipleCheckbox
              options={challengeOptions}
              selectedValues={challenges}
              onSelect={setChallenges}
            />

            <p className="mt-5 mb-2 text-gray-1 text-small-regular">
              Have you received any business training or support before?
            </p>
            <ChoiceChips
              choices={["Yes", "No"]}
              selectedChoice={receivedSupport}
              onSelectChoice={setReceivedSupport}
            />
            {receivedSupport === "Yes" && (
              <>
                <p className="mt-4 mb-2 text-gray-1 text-small-regular">
                  From which organisation or project?
                </p>
                <input
                  type="text"
                  className="simple_textinput"
                  placeholder="Eg: TangaYetu, AGRA"
                  value={supportOrg}
                  onChange={handleSupportOrgChange}
                />
              </>
            )}
          </div>

          <div className="flex flex-col px-6">
            <p className="mt-5 md:mt-0 mb-2 text-gray-1 text-small-regular">
              What kind of support are you looking for from IMED Connect? (select all that apply)
            </p>
            <MultipleCheckbox
              options={supportOptions}
              selectedValues={supportNeeded}
              onSelect={setSupportNeeded}
            />

            <p className="mt-5 mb-2 text-gray-1 text-small-regular">
              TIN / Business Registration Number (optional)
            </p>
            <input
              type="text"
              className="simple_textinput"
              placeholder="Eg: 123-456-789"
              value={tin}
              onChange={handleTinChange}
            />

            <p className="mt-5 mb-2 text-gray-1 text-small-regular">
              Do you have any form of disability?
            </p>
            <ChoiceChips
              choices={["Yes", "No"]}
              selectedChoice={disability}
              onSelectChoice={setDisability}
            />
            {disability === "Yes" && (
              <>
                <p className="mt-4 mb-2 text-gray-1 text-small-regular">
                  Please describe your disability
                </p>
                <input
                  type="text"
                  className="simple_textinput"
                  placeholder="Describe"
                  value={disabilityDesc}
                  onChange={handleDisabilityDescChange}
                />
              </>
            )}

            <div className="flex flex-row space-x-3 mt-6">
              <div className="w-full">
                <button
                  type="button"
                  onClick={loading ? null : backPressed}
                  className="outlined_simple_btn flex flex-row justify-center items-center gap-3"
                  disabled={loading}
                >
                  <Image
                    src="/icons/circle-chase-primary.svg"
                    className={`h-4 w-4 animate-spin ${loading ? "block" : "hidden"}`}
                    height={20}
                    width={20}
                    alt="loading"
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
                    className={`h-4 w-4 animate-spin ${loading ? "block" : "hidden"}`}
                    height={20}
                    width={20}
                    alt="loading"
                  />
                  <p>Submit</p>
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-5">
                <ErrorBody error={error} />
              </div>
            )}
            <div className="mx-auto mt-10">
              <TextButton text={"Log Out"} action={logOut} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntrepreneurStepFour;
