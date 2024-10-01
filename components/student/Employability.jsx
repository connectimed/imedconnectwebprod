import React, { useEffect, useState } from "react";
import { UserAuth } from "@/lib/context/AuthContext";
import Image from "next/image";
import { auth, db } from "@/lib/firebase/firebase";
import { Timestamp, doc, updateDoc } from "firebase/firestore";
import ErrorBody from "../shared/ErrorBody";
import TextButton from "../shared/TextButton";
import ChoiceChips from "../shared/ChoiceChips";
import SingleOptionDropdown from "../shared/SingleOptionDropdown";
import MonthYearInput from "../shared/MonthYearInput";

const pathways = [
  "Paid employment",
  "Self-employment (Entrepreneurship)",
  "Both paid and self-employment",
];

const engagements = [
  "Self-employed (entrepreneurship)",
  "Salaried job",
  "Internship/apprenticeship",
  "Supporting a family or extended family business",
  "Other",
];

const incomes = [
  "No income",
  "Below 500,000",
  "500,000 - 1,000,000",
  "Above 1,000,000",
];
const timings = [
  "09:00 AM – 11:00 AM",
  "12:00 PM – 02:00 PM",
  "03:00 PM – 5:00 PM",
  "After 5:00 PM",
];

const Employability = ({ userData }) => {
  const { fetchUserData, logOut, isLocalhost } = UserAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const [pathway, setPathway] = useState("Paid employment");
  const [engagement, setEngagement] = useState("Salaried job");
  const [income, setIncome] = useState("No income");
  const [businessPlan, setBusinessPlan] = useState("");
  const [businessStarted, setBusinessStarted] = useState("");
  const [support, setSupport] = useState("");
  const [interested, setInterested] = useState("");
  const [timing, setTiming] = useState("09:00 AM – 11:00 AM");
  const [disability, setDisability] = useState("");
  const [disabilityDesc, setDisabilityDesc] = useState("");

  const handlePathwayChange = (value) => {
    setPathway(value);
  };

  const handleIncomeChange = (value) => {
    setIncome(value);
  };

  const handleTimingChange = (value) => {
    setTiming(value);
  };

  const handleEngagementChange = (value) => {
    setEngagement(value);
  };

  const handleBusinessPlanChange = (e) => {
    const inputValue = e.target.value.slice(0, 600);
    setBusinessPlan(inputValue);
  };
  const handleBusinessStartedChange = (e) => {
    const inputValue = e.target.value.slice(0, 600);
    setBusinessStarted(inputValue);
  };
  const handledisabilityDescChange = (e) => {
    const inputValue = e.target.value.slice(0, 600);
    setDisabilityDesc(inputValue);
  };

  const saveData = async () => {
    const businessStartTime = new Date(year, month - 1);
    if (!support) {
      setError("Please select capacity-building support");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    if (!interested) {
      setError("Please select your interest in online training");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    if (!disability) {
      setError("Please select disability");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }
    if (disability === "Yes") {
      if (!disabilityDesc) {
        setError("Provide describe your disability");
        setTimeout(() => {
          setError("");
        }, 2000);
        return;
      }
    }

    if (month || year) {
      if (!month || month === "0" || !year || year.length < 4) {
        setError("Enter when you started doing business");
        setTimeout(() => {
          setError("");
        }, 2000);
        return;
      }
      if (isNaN(businessStartTime.getTime())) {
        setError("Please enter a valid month and year");
        setTimeout(() => {
          setError("");
        }, 2000);
        return;
      }
    }

    setLoading(true);
    try {
      const userRef = doc(db, "Users", userData.user_id);
      await updateDoc(userRef, {
        user_profile_setup_step: "8",
        user_preferred_career_pathway: pathway,
        user_employment_status: engagement,
        user_monthly_income: income,
        user_business_plan: businessPlan,
        user_business_started: businessStarted,
        user_business_start_time: Timestamp.fromDate(businessStartTime),
        user_has_received_support: support,
        user_mentorship_interested: interested,
        user_online_availability: timing,
        user_is_disabled: disability,
        user_disability_description: disabilityDesc,
      });
      fetchUserData(userData.user_id);

      console.log("Updated");
      setLoading(false);
    } catch (error) {
      console.error("Error Updating Data:", error);
    }
  };

  return (
    <div>
      <div className="mx-auto bg-white rounded-lg pt-4 pb-10">
        <p className="text-heading3-bold px-6">Employability & Needs</p>
        <p className="text-small-regular text-gray-1 px-6">
          Please fill out this form to help us understand your current
          employment status, skills, and areas where you need support. Your
          responses will assist us in tailoring our services to better meet your
          needs and improve your employability. All information provided will be
          kept confidential and used solely for the purpose of enhancing our
          support programs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 mt-4">
          <div className="flex flex-col px-6">
            <p className="mt-1 mb-2 text-gray-1 text-small-regular">
              What is your preferred career pathway?
            </p>
            <SingleOptionDropdown
              options={pathways}
              selectedValue={pathway}
              onSelect={handlePathwayChange}
            />
            <p className="mt-5 mb-2 text-gray-1 text-small-regular">
              Are you currently engaged in any of the following?
            </p>
            <SingleOptionDropdown
              options={engagements}
              selectedValue={engagement}
              onSelect={handleEngagementChange}
            />
            <p className="mt-5 mb-2 text-gray-1 text-small-regular">
              What is your average income per month (TZS)?
            </p>
            <SingleOptionDropdown
              options={incomes}
              selectedValue={income}
              onSelect={handleIncomeChange}
            />
            <p className="mt-5 mb-2 text-gray-1 text-small-regular">
              If you are planning to start a business as your source of
              employment, what type of business are you planning to start or in?
            </p>
            <div className="">
              <textarea
                rows={3}
                className="simple_textinput max-h-32 min-h-24"
                defaultValue={""}
                placeholder="Describe the business"
                value={businessPlan}
                onChange={handleBusinessPlanChange}
              />
            </div>

            <p className="mt-5 mb-2 text-gray-1 text-small-regular">
              If you have started doing business, what type of business you are
              doing?
            </p>
            <div className="">
              <textarea
                rows={3}
                className="simple_textinput max-h-32 min-h-24"
                defaultValue={""}
                placeholder="Describe the business"
                value={businessStarted}
                onChange={handleBusinessStartedChange}
              />
            </div>
            <p className="mt-5 mb-2 text-gray-1 text-small-regular">
              If you have already started your business, which month and year
              did you start? (leave blank if doesnt apply)
            </p>
            <MonthYearInput
              month={month}
              year={year}
              onMonthChange={setMonth}
              onYearChange={setYear}
            />
          </div>
          <div className="flex flex-col px-6">
            <p className="mt-5 md:mt-0 mb-2 text-gray-1 text-small-regular">
              Have you received any capacity-building support to develop your
              employability capacity/skills for salaried or self-employment?
            </p>
            <div className="">
              <ChoiceChips
                choices={["Yes", "No"]}
                selectedChoice={support}
                onSelectChoice={setSupport}
              />
            </div>

            <p className="mt-5 mb-2 text-gray-1 text-small-regular">
              Are you interested in attending an online training and mentorship
              program for salaried jobs and self-employment?
            </p>
            <div className="">
              <ChoiceChips
                choices={["Yes", "No"]}
                selectedChoice={interested}
                onSelectChoice={setInterested}
              />
            </div>
            <p className="mt-5 mb-2 text-gray-1 text-small-regular">
              What time is most favorable for you to attend online training?
            </p>
            <SingleOptionDropdown
              options={timings}
              selectedValue={timing}
              onSelect={handleTimingChange}
            />

            <p className="mt-5 mb-2 text-gray-1 text-small-regular">
              Do you have any form of disability?
            </p>
            <div className="">
              <ChoiceChips
                choices={["Yes", "No"]}
                selectedChoice={disability}
                onSelectChoice={setDisability}
              />
            </div>
            {disability === "Yes" && (
              <div>
                <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                  Please describe your disability
                </p>
                <div className="">
                  <input
                    type="text"
                    className="simple_textinput"
                    placeholder="Describe"
                    value={disabilityDesc}
                    onChange={handledisabilityDescChange}
                  />
                </div>
              </div>
            )}
            <div className="w-full mt-6">
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
                  <p>Submit</p>
                </button>
              </div>
            </div>
            {error && (
              <div className="mt-5">
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
  );
};

export default Employability;
