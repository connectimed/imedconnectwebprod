import React, { useEffect, useState } from "react";
import { UserAuth } from "@/lib/context/AuthContext";
import Image from "next/image";
import { auth, db } from "@/lib/firebase/firebase";
import { Timestamp, doc, updateDoc } from "firebase/firestore";
import ErrorBody from "../shared/ErrorBody";
import TextButton from "../shared/TextButton";
import ChoiceChips from "../shared/ChoiceChips";
import SingleOptionDropdown from "../shared/SingleOptionDropdown";
import MultipleCheckbox from "../shared/MultipleCheckbox";

const levels = [
  "Local Government Authority (LGA) Business License",
  "TIN Certificate",
  "Business Name Registration (BRELA)",
  "Registered as a limited Company",
  "Registered Group",
  "Having a business premises or address",
  "Own and operate a business bank account",
];

const ownershipTypes = [
  "Sole proprietorship",
  "Partnership",
  "Limited Company",
  "Group",
];

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

const Employability = ({ userData }) => {
  const { fetchUserData, logOut, isLocalhost } = UserAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [level, setLevel] = useState([]);
  const [jobsAppliedAndInterviewed, setJobsApplied] = useState("");
  const [ownershipType, setOwnershipType] = useState("Partnership");
  const [pathway, setPathway] = useState("Paid employment");
  const [engagement, setEngagement] = useState("Salaried job");
  const [businessPlan, setBusinessPlan] = useState("");
  const [support, setSupport] = useState("No");
  const [interested, setInterested] = useState("Yes");
  const [disability, setDisability] = useState("");
  const [disabilityDesc, setDisabilityDesc] = useState("");
  const [isSeeking, setIsSeekingEmployment] = useState("No");
  const [ownershipDesc, setOwnershipDesc] = useState("");
  const [businessOwnership, setBusinessOwnership] = useState("No");
  const [formalized, setFormalization] = useState("");

  const handlePathwayChange = (value) => {
    setPathway(value);
  };

  const handleOwnershipDescChange = (e) => {
    const inputValue = e.target.value.slice(0, 600);
    setOwnershipDesc(inputValue);
  };
  const handleLevelsChange = (level) => {
    setLevel(level);
  };

  const handleOwnershipTypeChange = (value) => {
    setOwnershipType(value);
  };

  const handleJobsAppliedAndInterviewedChange = (e) => {
    const inputValue = e.target.value.slice(0, 60);
    setJobsApplied(inputValue);
  };

  const handleEngagementChange = (value) => {
    setEngagement(value);
  };

  const handleBusinessPlanChange = (e) => {
    const inputValue = e.target.value.slice(0, 600);
    setBusinessPlan(inputValue);
  };

  const handledisabilityDescChange = (e) => {
    const inputValue = e.target.value.slice(0, 600);
    setDisabilityDesc(inputValue);
  };

  const saveData = async () => {
    if (businessOwnership === "Yes" && ownershipDesc.length < 120) {
      setError("Describe your business in detail.");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }
    if (businessOwnership === "Yes" && !formalized) {
      setError("Please select formalization.");
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
    if (disability === "Yes" && !disabilityDesc) {
      setError("Provide describe your disability");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, "Users", userData.user_id);
      await updateDoc(userRef, {
        user_profile_setup_step: "8",
        user_preferred_career_pathway: pathway,
        user_employment_status: engagement,
        user_owns_business: businessOwnership,
        user_business_ownership_details: ownershipDesc,
        user_business_is_formalized: formalized,
        user_business_formalization_level: level,
        user_business_ownership_type: ownershipType,
        user_is_seeking_employment: isSeeking,
        user_business_plan: businessPlan,
        user_has_received_support: support,
        user_mentorship_interested: interested,
        user_has_disability: disability,
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
        <p className="text-heading3-bold px-6">Baseline & Employability</p>
        <p className="text-small-regular text-gray-1 px-6">
          Please complete this form to help us assess your current career
          readiness, employment status, and skillset. Your input will enable us
          to provide more personalized support and resources, helping you build
          a strong foundation for future career success. All information you
          share will remain confidential and be used exclusively to improve our
          support programs and enhance your employability.
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
            <p className="mt-4 mb-2 text-gray-1 text-small-regular">
              Do you own or operate any business?
            </p>
            <div className="">
              <ChoiceChips
                choices={["Yes", "No"]}
                selectedChoice={businessOwnership}
                onSelectChoice={setBusinessOwnership}
              />
            </div>
            {businessOwnership === "Yes" && (
              <div>
                <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                  Briefly describe your business, including its purpose, start
                  date (month and year), location, number of full-time and
                  part-time employees (by gender), and estimated average monthly
                  sales and profit (in Tshs).
                </p>
                <div className="">
                  <textarea
                    rows={3}
                    className="simple_textinput max-h-32 min-h-24"
                    defaultValue={""}
                    placeholder="Description"
                    value={ownershipDesc}
                    onChange={handleOwnershipDescChange}
                  />
                </div>

                {/* formalization */}
                <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                  Is your business formalized?
                </p>
                <div className="">
                  <ChoiceChips
                    choices={["Yes", "No"]}
                    selectedChoice={formalized}
                    onSelectChoice={setFormalization}
                  />
                </div>
                {formalized === "Yes" && (
                  <div>
                    <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                      Please specify the level of business formalization you are
                      involved in.
                    </p>

                    <MultipleCheckbox
                      options={levels}
                      selectedValues={level}
                      onSelect={handleLevelsChange}
                    />
                  </div>
                )}

                {formalized === "Yes" && (
                  <div>
                    <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                      Type of business ownership
                    </p>

                    <SingleOptionDropdown
                      options={ownershipTypes}
                      selectedValue={ownershipType}
                      onSelect={handleOwnershipTypeChange}
                    />
                  </div>
                )}
              </div>
            )}

            {businessOwnership === "No" && (
              <div>
                <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                  If you are planning to start a business as your source of
                  employment, what type of business are you planning to start or
                  in?
                </p>
                <div className="">
                  <textarea
                    rows={3}
                    className="simple_textinput max-h-32 min-h-24"
                    defaultValue={""}
                    placeholder="Description"
                    value={businessPlan}
                    onChange={handleBusinessPlanChange}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col px-6">
            <p className="mt-5 md:mt-0 mb-2 text-gray-1 text-small-regular">
              Are you currently actively seeking employment?
            </p>
            <div className="">
              <ChoiceChips
                choices={["Yes", "No"]}
                selectedChoice={isSeeking}
                onSelectChoice={setIsSeekingEmployment}
              />
            </div>

            <p className="mt-4 mb-3 text-gray-1 text-small-regular">
              Since you started looking for work, how many jobs have you applied
              for and how many interviews have you attended?
            </p>
            <div className="">
              <input
                type="text"
                className="simple_textinput"
                placeholder="Eg: 10 jobs applied, 5 jobs interviewed."
                value={jobsAppliedAndInterviewed}
                onChange={handleJobsAppliedAndInterviewedChange}
              />
            </div>

            <p className="mt-4 mb-2 text-gray-1 text-small-regular">
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
