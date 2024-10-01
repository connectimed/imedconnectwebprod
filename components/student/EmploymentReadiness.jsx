import React, { useEffect, useState } from "react";
import { UserAuth } from "@/lib/context/AuthContext";
import Image from "next/image";
import { auth, db } from "@/lib/firebase/firebase";
import { Timestamp, doc, updateDoc } from "firebase/firestore";
import ProgressIndicator from "../shared/ProgressIndicator";
import ErrorBody from "../shared/ErrorBody";
import TextButton from "../shared/TextButton";
import CoursesComboBox from "../shared/CoursesComboBox";
import InstitutionsComboBox from "../shared/InstitutionsComboBox";
import YearInput from "../shared/YearInput";
import ChoiceChips from "../shared/ChoiceChips";
import DateInput from "../shared/DateInput";
import RegionsComboBox from "../shared/RegionsComboBox";
import DistrictsComboBox from "../shared/DistrictsComboBox";
import locations from "@/constants/locations";
import Interests from "../mentor/Interests";
import MultipleCheckbox from "../shared/MultipleCheckbox";
import SingleOptionDropdown from "../shared/SingleOptionDropdown";
import MonthYearInput from "../shared/MonthYearInput";

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

const opportunities = [
  "Full-time work",
  "Part-time work",
  "Internship",
  "Paid Volunteer",
  "Unpaid Volunteer",
  "None of the above",
];

const EmploymentReadiness = ({ userData }) => {
  const { fetchUserData, logOut, isLocalhost } = UserAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [educationLevel, setEducationLevel] = useState("Degree");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [institution, setInstitution] = useState("");
  const [businessOwnership, setBusinessOwnership] = useState("");
  const [ownershipDesc, setOwnershipDesc] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const [formalization, setFormalization] = useState("");
  const [level, setLevel] = useState([]);
  const [expertise, setExpertise] = useState([]);
  const [ownershipType, setOwnershipType] = useState("Partnership");
  const [businessLocation, setBusinessLocation] = useState("");

  const [maleOwners, setMaleOwners] = useState("");
  const [femaleOwners, setFemaleOwners] = useState("");
  const [maleFullTime, setMaleFullTime] = useState("");
  const [femaleFullTime, setFemaleFullTime] = useState("");
  const [malePartTime, setMalePartTime] = useState("");
  const [femalePartTime, setFemalePartTime] = useState("");
  const [sales, setSales] = useState("");
  const [profit, setProfit] = useState("");
  const [opportunity, setOpportunity] = useState("Internship");
  const [workPlace, setWorkPlace] = useState("");
  const [employment, setEmployment] = useState("");
  const [jobsApplied, setJobsApplied] = useState("");
  const [interviews, setInterviews] = useState("");

  const regions = locations.map((location) => ({
    label: location.region,
    value: location.region,
  }));

  const districts = selectedRegion
    ? locations
        .find((location) => location.region === selectedRegion.value)
        .district.map((district) => ({
          label: district.name,
          value: district.name,
        }))
    : [];

  const handleBusinessLocationChange = (e) => {
    const inputValue = e.target.value.slice(0, 80);
    setBusinessLocation(inputValue);
  };

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    setSelectedDistrict(null); // Reset district when region changes
  };

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
  };

  const handleLevelsChange = (level) => {
    setLevel(level);
  };

  const handleOpportunityChange = (value) => {
    setOpportunity(value);
  };

  const handleOwnershipChange = (e) => {
    const inputValue = e.target.value.slice(0, 600);
    setOwnershipDesc(inputValue);
  };

  const handleEducationLevelChange = (value) => {
    setEducationLevel(value);
  };
  const handleOwnershipTypeChange = (value) => {
    setOwnershipType(value);
  };

  const handleMaleOwnersChange = (e) => {
    const inputValue = e.target.value.slice(0, 3);
    const numericValue = inputValue.replace(/\D/g, "");
    setMaleOwners(numericValue);
  };
  const handleFemaleOwnersChange = (e) => {
    const inputValue = e.target.value.slice(0, 3);
    const numericValue = inputValue.replace(/\D/g, "");
    setFemaleOwners(numericValue);
  };
  const handleMaleFullTimeChange = (e) => {
    const inputValue = e.target.value.slice(0, 3);
    const numericValue = inputValue.replace(/\D/g, "");
    setMaleFullTime(numericValue);
  };
  const handleFamaleFullTimeChange = (e) => {
    const inputValue = e.target.value.slice(0, 3);
    const numericValue = inputValue.replace(/\D/g, "");
    setFemaleFullTime(numericValue);
  };

  const handleMalePartTimeChange = (e) => {
    const inputValue = e.target.value.slice(0, 3);
    const numericValue = inputValue.replace(/\D/g, "");
    setMalePartTime(numericValue);
  };
  const handleFemalePartTimeChange = (e) => {
    const inputValue = e.target.value.slice(0, 3);
    const numericValue = inputValue.replace(/\D/g, "");
    setFemalePartTime(numericValue);
  };

  const handleSalesChange = (e) => {
    const inputValue = e.target.value.slice(0, 9);
    const numericValue = inputValue.replace(/\D/g, "");
    setSales(numericValue);
  };
  const handleProfitChange = (e) => {
    const inputValue = e.target.value.slice(0, 9);
    const numericValue = inputValue.replace(/\D/g, "");
    setProfit(numericValue);
  };

  const handleWorkPlaceChange = (e) => {
    const inputValue = e.target.value.slice(0, 120);
    setWorkPlace(inputValue);
  };

  const handleJobsAppliedChange = (e) => {
    const inputValue = e.target.value.slice(0, 9);
    const numericValue = inputValue.replace(/\D/g, "");
    setJobsApplied(numericValue);
  };

  const handleInterviewsChange = (e) => {
    const inputValue = e.target.value.slice(0, 9);
    const numericValue = inputValue.replace(/\D/g, "");
    setInterviews(numericValue);
  };

  const handleInstitutionChange = (e) => {
    const inputValue = e.target.value.slice(0, 80);
    setInstitution(inputValue);
  };

  const handleYearChange = (year) => {
    console.log("Selected year:", year);
    setYear(year);
  };

  const saveData = async () => {
    const businessStartTime = new Date(year, month - 1);
    if (!businessOwnership) {
      setError("Please select business ownership");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }
    if (businessOwnership === "Yes") {
      if (!ownershipDesc) {
        setError("Provide brief details about your business");
        setTimeout(() => {
          setError("");
        }, 2000);
        return;
      }

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

      if (businessLocation.length < 10) {
        setError("Please enter a valid business location");
        setTimeout(() => {
          setError("");
        }, 2000);
        return;
      }
    }

    if (!formalization) {
      setError("Please select business formalization");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    if (formalization === "Yes") {
      if (level.length < 1) {
        setError("Please specify the level of formalization");
        setTimeout(() => {
          setError("");
        }, 2000);
        return;
      }

      if (ownershipType === "Sole proprietorship" && !maleOwners) {
        setError("Enter the number of male owners");
        setTimeout(() => {
          setError("");
        }, 2000);
        return;
      }

      if (ownershipType === "Sole proprietorship" && !femaleOwners) {
        setError("Enter the number of female owners");
        setTimeout(() => {
          setError("");
        }, 2000);
        return;
      }

      if (!maleFullTime) {
        setError("Enter the number of male full time employees");
        setTimeout(() => {
          setError("");
        }, 2000);
        return;
      }

      if (!femaleFullTime) {
        setError("Enter the number of female full time employees");
        setTimeout(() => {
          setError("");
        }, 2000);
        return;
      }

      if (!malePartTime) {
        setError("Enter the number of male part time employees");
        setTimeout(() => {
          setError("");
        }, 2000);
        return;
      }

      if (!femalePartTime) {
        setError("Enter the number of female part time employees");
        setTimeout(() => {
          setError("");
        }, 2000);
        return;
      }

      if (!sales) {
        setError("Enter monthly sales");
        setTimeout(() => {
          setError("");
        }, 2000);
        return;
      }

      if (!profit) {
        setError("Enter monthly profit");
        setTimeout(() => {
          setError("");
        }, 2000);
        return;
      }
    }

    if (opportunity !== "None of the above" && !workPlace) {
      setError("Please specify job details");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    if (!employment) {
      setError("Specify if you are seeking employment");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    if (!jobsApplied) {
      setError("Please enter the number of jobs applied");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }
    if (!interviews) {
      setError("Please enter the number of interviews attended");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, "Users", userData.user_id);
      await updateDoc(userRef, {
        user_profile_setup_step: "10",
        user_owns_business: businessOwnership,
        user_business_ownership_details: ownershipDesc,
        user_business_start_time: Timestamp.fromDate(businessStartTime),
        user_business_location: businessLocation,
        user_business_formalization_level: formalization,
        user_business_ownership_type: ownershipType,
        user_business_male_owners: maleOwners,
        user_business_female_owners: femaleOwners,
        user_business_male_full_time: maleFullTime,
        user_business_female_full_time: femaleFullTime,
        user_business_male_part_time: malePartTime,
        user_business_female_part_time: femalePartTime,
        user_business_sales: sales,
        user_business_profit: profit,
        user_current_opportunity: opportunity,
        user_work_place: workPlace,
        user_current_employment_status: employment,
        user_jobs_applied: jobsApplied,
        user_interviews_attended: interviews,
      });
      fetchUserData(userData.user_id);

      console.log("updated");
      setLoading(false);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <div>
      <div className="mx-auto bg-white rounded-lg py-4">
        <p className="text-heading3-bold px-6">Baseline Form</p>
        <p className="text-small-regular text-gray-1 px-6">
          Please complete the form below to provide additional details about
          your employment readiness. Your thorough and accurate responses are
          essential for us to effectively assess your qualifications and
          readiness for employment. Ensure all information is precise and
          relevant to give a clear picture of your current status and
          capabilities.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 mt-4">
          <div className="flex flex-col px-6">
            <p className="mt-1 mb-2 text-gray-1 text-small-regular">
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
                  Please provide brief details about your business.
                </p>
                <div className="">
                  <textarea
                    rows={3}
                    className="simple_textinput max-h-32 min-h-24"
                    defaultValue={""}
                    placeholder="Description"
                    value={ownershipDesc}
                    onChange={handleOwnershipChange}
                  />
                </div>
                <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                  When did you start doing business?
                </p>
                <MonthYearInput
                  month={month}
                  year={year}
                  onMonthChange={setMonth}
                  onYearChange={setYear}
                />

                <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                  The location where your business resides
                </p>
                <div className="">
                  <input
                    type="text"
                    className="simple_textinput"
                    placeholder="Country, Region, District and ward"
                    value={businessLocation}
                    onChange={handleBusinessLocationChange}
                  />
                </div>
              </div>
            )}

            {selectedRegion && (
              <div className="mt-4">
                <DistrictsComboBox
                  districts={districts}
                  onChange={handleDistrictChange}
                  placeholder="Select a district"
                  selectedRegion={selectedRegion}
                />
              </div>
            )}

            {/* formalization */}
            <p className="mt-5 mb-2 text-gray-1 text-small-regular">
              Is your business formalized?
            </p>
            <div className="">
              <ChoiceChips
                choices={["Yes", "No"]}
                selectedChoice={formalization}
                onSelectChoice={setFormalization}
              />
            </div>
            {formalization === "Yes" && (
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

            {formalization === "Yes" && (
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

            {formalization === "Yes" &&
              ownershipType === "Sole proprietorship" && (
                <div>
                  <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                    Please state the number of male and female owners in your
                    business. (Enter 0 where none)
                  </p>

                  <div className="flex flex-row space-x-4">
                    <div className="max-w-32">
                      <input
                        type="text"
                        className="simple_textinput"
                        placeholder="No. of male"
                        value={maleOwners}
                        onChange={handleMaleOwnersChange}
                      />
                    </div>
                    <div className="max-w-32">
                      <input
                        type="text"
                        className="simple_textinput"
                        placeholder="No. of female"
                        value={femaleOwners}
                        onChange={handleFemaleOwnersChange}
                      />
                    </div>
                  </div>
                </div>
              )}

            {formalization === "Yes" && (
              <div>
                <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                  How many full time employees does the business have at the
                  moment? (Enter 0 where none)
                </p>

                <div className="flex flex-row space-x-4">
                  <div className="max-w-32">
                    <input
                      type="text"
                      className="simple_textinput"
                      placeholder="No. of male"
                      value={maleFullTime}
                      onChange={handleMaleFullTimeChange}
                    />
                  </div>
                  <div className="max-w-32">
                    <input
                      type="text"
                      className="simple_textinput"
                      placeholder="No. of female"
                      value={femaleFullTime}
                      onChange={handleFamaleFullTimeChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {formalization === "Yes" && (
              <div>
                <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                  How many part time employees does the business have at the
                  moment? (Enter 0 where none)
                </p>

                <div className="flex flex-row space-x-4">
                  <div className="max-w-32">
                    <input
                      type="text"
                      className="simple_textinput"
                      placeholder="No. of male"
                      value={malePartTime}
                      onChange={handleMalePartTimeChange}
                    />
                  </div>
                  <div className="max-w-32">
                    <input
                      type="text"
                      className="simple_textinput"
                      placeholder="No. of female"
                      value={femalePartTime}
                      onChange={handleFemalePartTimeChange}
                    />
                  </div>
                </div>
                <div>
                  <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                    What is your estimated average sales and profit revenue per
                    month (Tshs)?
                  </p>

                  <div className="flex flex-row space-x-4">
                    <div className="max-w-48">
                      <input
                        type="text"
                        className="simple_textinput"
                        placeholder="Sales"
                        value={sales}
                        onChange={handleSalesChange}
                      />
                    </div>
                    <div className="max-w-48">
                      <input
                        type="text"
                        className="simple_textinput"
                        placeholder="Profit"
                        value={profit}
                        onChange={handleProfitChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col px-6">
            <p className="mt-1 mb-2 text-gray-1 text-small-regular">
              Are you currently engaged in any of the following career
              opportunities?
            </p>
            <SingleOptionDropdown
              options={opportunities}
              selectedValue={opportunity}
              onSelect={handleOpportunityChange}
            />

            {opportunity !== "None of the above" && (
              <div>
                <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                  Please specify your job title, company, and industry in which
                  you work.
                </p>
                <div className="">
                  <input
                    type="text"
                    className="simple_textinput"
                    placeholder="Company, Job title and industry"
                    value={workPlace}
                    onChange={handleWorkPlaceChange}
                  />
                </div>
              </div>
            )}

            <p className="mt-5 mb-2 text-gray-1 text-small-regular">
              Are you currently actively seeking employment?
            </p>
            <div className="">
              <ChoiceChips
                choices={["Yes", "No"]}
                selectedChoice={employment}
                onSelectChoice={setEmployment}
              />
            </div>

            <p className="mt-6 mb-3 text-gray-1 text-small-regular">
              Since you started looking for work, how many jobs have you applied
              for?
            </p>
            <div className="">
              <input
                type="text"
                className="simple_textinput"
                placeholder="Number of jobs applied"
                value={jobsApplied}
                onChange={handleJobsAppliedChange}
              />
            </div>
            <p className="mt-6 mb-3 text-gray-1 text-small-regular">
              Since you started looking for work, how many interviews have you
              attended?
            </p>
            <div className="">
              <input
                type="text"
                className="simple_textinput"
                placeholder="Number of interviews attended"
                value={interviews}
                onChange={handleInterviewsChange}
              />
            </div>
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

export default EmploymentReadiness;
