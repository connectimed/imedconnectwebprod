import React, { useState } from "react";
import { UserAuth } from "@/lib/context/AuthContext";
import Image from "next/image";
import { db } from "@/lib/firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import ProgressIndicator from "../shared/ProgressIndicator";
import ErrorBody from "../shared/ErrorBody";
import TextButton from "../shared/TextButton";
import ChoiceChips from "../shared/ChoiceChips";
import MultipleCheckbox from "../shared/MultipleCheckbox";
import SingleOptionDropdown from "../shared/SingleOptionDropdown";

const sectors = [
  "Agriculture",
  "Livestock",
  "Fishing",
  "Processing",
  "Services",
  "Trade",
  "Other",
];

const agriValueChains = [
  "Maize",
  "Rice",
  "Sunflower",
  "Horticulture (vegetables & fruits)",
  "Poultry",
  "Animal Keeping (livestock)",
  "Cassava",
  "Beans",
  "Other",
];

const formalizationOptions = [
  "Not registered",
  "Registered through BRELA",
  "Other Registrations (e.g. local authority, cooperative)",
  "I have no business",
];

const yearsOptions = [
  "Less than 1 year",
  "1–3 years",
  "4–5 years",
  "More than 5 years",
];

const EntrepreneurStepThree = ({ userData }) => {
  const { fetchUserData, logOut } = UserAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [sector, setSector] = useState("");
  const [valueChains, setValueChains] = useState([]);
  const [mainActivity, setMainActivity] = useState("");
  const [formalization, setFormalization] = useState("");
  const [yearsOfOperation, setYearsOfOperation] = useState("Less than 1 year");
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");

  const handleMainActivityChange = (e) => {
    setMainActivity(e.target.value.slice(0, 600));
  };

  const handleRegionChange = (e) => {
    setRegion(e.target.value.slice(0, 80));
  };

  const handleDistrictChange = (e) => {
    setDistrict(e.target.value.slice(0, 80));
  };

  const saveData = async () => {
    if (!sector) {
      setError("Please select your type of business.");
      setTimeout(() => setError(""), 2000);
      return;
    }
    if (mainActivity.length < 10) {
      setError("Please describe your main business activity (at least 10 characters).");
      setTimeout(() => setError(""), 2000);
      return;
    }
    if (!formalization) {
      setError("Please select your business formalization status.");
      setTimeout(() => setError(""), 2000);
      return;
    }
    if (region.trim().length < 3) {
      setError("Please enter your business region.");
      setTimeout(() => setError(""), 2000);
      return;
    }
    if (district.trim().length < 3) {
      setError("Please enter your business district.");
      setTimeout(() => setError(""), 2000);
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, "Users", userData.user_id);
      await updateDoc(userRef, {
        user_profile_setup_step: "4",
        user_highest_institution_name: businessName.trim(),
        user_preferred_sector_to_specialize: sector,
        user_areas_of_expertise: valueChains,
        user_business_ownership_details: mainActivity.trim(),
        user_business_is_formalized: formalization,
        user_business_started: yearsOfOperation,
        user_region: region.trim(),
        user_district: district.trim(),
      });
      fetchUserData(userData.user_id);
      setLoading(false);
    } catch (err) {
      console.error("Error updating data:", err);
      setLoading(false);
    }
  };

  const backPressed = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, "Users", userData.user_id);
      await updateDoc(userRef, { user_profile_setup_step: "2" });
      fetchUserData(userData.user_id);
      setLoading(false);
    } catch (err) {
      console.error("Error updating data:", err);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="hidden md:flex items-center justify-center rounded-lg md:rounded-r-none md:rounded-l-lg bg-[#e2ecf5]">
            <Image
              className="object-contain rounded-lg p-10"
              src="/images/decider.png"
              height={626}
              width={626}
              alt="business profile"
            />
          </div>
          <div className="rounded-lg md:rounded-l-none md:rounded-r-lg bg-white">
            <div className="mx-auto max-w-md px-6 py-6">
              <ProgressIndicator currentStep={4} />

              <h1 className="text-base-semibold font-bold sm:text-body1-bold text-primary-dark-blue mt-10">
                Tell us about your business.
              </h1>
              <p className="mt-1 mb-4 text-gray-1 text-small-regular">
                Help us understand your work so we can connect you with the right support.
              </p>

              <p className="mb-2 text-gray-1 text-small-regular">
                Business name (if applicable)
              </p>
              <input
                type="text"
                className="simple_textinput"
                placeholder="Eg: Kilimo Fresh Ltd"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value.slice(0, 100))}
              />

              <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                Type of business / sector
              </p>
              <ChoiceChips
                choices={sectors}
                selectedChoice={sector}
                onSelectChoice={setSector}
              />

              {sector === "Agriculture" && (
                <>
                  <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                    Which agricultural value chain do you work with?
                  </p>
                  <MultipleCheckbox
                    options={agriValueChains}
                    selectedValues={valueChains}
                    onSelect={setValueChains}
                  />
                </>
              )}

              <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                Main activity / core business — describe your main product or service
              </p>
              <textarea
                rows={3}
                className="simple_textinput max-h-32 min-h-24"
                placeholder="Eg: Selling fresh vegetables directly to households in Dar es Salaam"
                value={mainActivity}
                onChange={handleMainActivityChange}
              />

              <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                Is your business formalized / registered?
              </p>
              <ChoiceChips
                choices={formalizationOptions}
                selectedChoice={formalization}
                onSelectChoice={setFormalization}
              />

              <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                Years of business operation
              </p>
              <SingleOptionDropdown
                options={yearsOptions}
                selectedValue={yearsOfOperation}
                onSelect={setYearsOfOperation}
              />

              <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                Region where your business operates
              </p>
              <input
                type="text"
                className="simple_textinput"
                placeholder="Eg: Arusha"
                value={region}
                onChange={handleRegionChange}
              />

              <p className="mt-4 mb-2 text-gray-1 text-small-regular">
                District where your business operates
              </p>
              <input
                type="text"
                className="simple_textinput"
                placeholder="Eg: Arumeru"
                value={district}
                onChange={handleDistrictChange}
              />

              <div className="flex flex-row space-x-3 mx-auto mt-6">
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
                    <p>Next</p>
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-4">
                  <ErrorBody error={error} />
                </div>
              )}
              <div className="mx-auto mt-8">
                <TextButton text={"Log Out"} action={logOut} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntrepreneurStepThree;
