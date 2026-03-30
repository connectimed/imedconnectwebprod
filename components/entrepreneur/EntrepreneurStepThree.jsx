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
import { useLanguage } from "@/lib/context/LanguageContext";

const EntrepreneurStepThree = ({ userData }) => {
  const { fetchUserData, logOut } = UserAuth();
  const { t } = useLanguage();

  const sectors = [
    { label: t("ent_sector_agriculture"), value: "Agriculture" },
    { label: t("ent_sector_livestock"),   value: "Livestock" },
    { label: t("ent_sector_fishing"),     value: "Fishing" },
    { label: t("ent_sector_processing"),  value: "Processing" },
    { label: t("ent_sector_services"),    value: "Services" },
    { label: t("ent_sector_trade"),       value: "Trade" },
    { label: t("ent_sector_other"),       value: "Other" },
  ];

  const agriValueChains = [
    { label: t("vc_maize"),        value: "Maize" },
    { label: t("vc_rice"),         value: "Rice" },
    { label: t("vc_sunflower"),    value: "Sunflower" },
    { label: t("vc_horticulture"), value: "Horticulture (vegetables & fruits)" },
    { label: t("vc_poultry"),      value: "Poultry" },
    { label: t("vc_livestock"),    value: "Animal Keeping (livestock)" },
    { label: t("vc_cassava"),      value: "Cassava" },
    { label: t("vc_beans"),        value: "Beans" },
    { label: t("vc_other"),        value: "Other" },
  ];

  const formalizationOptions = [
    { label: t("form_not_registered"), value: "Not registered" },
    { label: t("form_brela"),          value: "Registered through BRELA" },
    { label: t("form_other"),          value: "Other Registrations (e.g. local authority, cooperative)" },
    { label: t("form_no_business"),    value: "I have no business" },
  ];

  const yearsOptions = [
    "Less than 1 year",
    "1–3 years",
    "4–5 years",
    "More than 5 years",
  ];
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
      setError(t("ent_step3_error_sector"));
      setTimeout(() => setError(""), 2000);
      return;
    }
    if (mainActivity.length < 10) {
      setError(t("ent_step3_error_activity"));
      setTimeout(() => setError(""), 2000);
      return;
    }
    if (!formalization) {
      setError(t("ent_step3_error_formalization"));
      setTimeout(() => setError(""), 2000);
      return;
    }
    if (region.trim().length < 3) {
      setError(t("ent_step3_error_region"));
      setTimeout(() => setError(""), 2000);
      return;
    }
    if (district.trim().length < 3) {
      setError(t("ent_step3_error_district"));
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
      setError(t("ent_step3_error_generic"));
      setTimeout(() => setError(""), 3000);
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
                {t("ent_step3_heading")}
              </h1>
              <p className="mt-1 mb-4 text-gray-1 text-small-regular">
                {t("ent_step3_subtitle")}
              </p>

              <p className="mb-2 text-gray-1 text-small-regular">
                {t("ent_step3_biz_name_label")}
              </p>
              <input
                type="text"
                className="simple_textinput"
                placeholder={t("ent_step3_biz_name_placeholder")}
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value.slice(0, 100))}
              />

              <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                {t("ent_step3_sector_label")}
              </p>
              <ChoiceChips
                choices={sectors}
                selectedChoice={sector}
                onSelectChoice={(val) => {
                  setSector(val);
                  if (val !== "Agriculture") setValueChains([]);
                }}
              />

              {sector === "Agriculture" && (
                <>
                  <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                    {t("ent_step3_value_chain_question")}
                  </p>
                  <MultipleCheckbox
                    options={agriValueChains}
                    selectedValues={valueChains}
                    onSelect={setValueChains}
                  />
                </>
              )}

              <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                {t("ent_step3_activity_label")}
              </p>
              <textarea
                rows={3}
                className="simple_textinput max-h-32 min-h-24"
                placeholder={t("ent_step3_activity_placeholder")}
                value={mainActivity}
                onChange={handleMainActivityChange}
              />

              <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                {t("ent_step3_formalization_label")}
              </p>
              <ChoiceChips
                choices={formalizationOptions}
                selectedChoice={formalization}
                onSelectChoice={setFormalization}
              />

              <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                {t("ent_step3_years_label")}
              </p>
              <SingleOptionDropdown
                options={yearsOptions}
                selectedValue={yearsOfOperation}
                onSelect={setYearsOfOperation}
              />

              <p className="mt-5 mb-2 text-gray-1 text-small-regular">
                {t("ent_step3_region_label")}
              </p>
              <input
                type="text"
                className="simple_textinput"
                placeholder={t("ent_step3_region_placeholder")}
                value={region}
                onChange={handleRegionChange}
              />

              <p className="mt-4 mb-2 text-gray-1 text-small-regular">
                {t("ent_step3_district_label")}
              </p>
              <input
                type="text"
                className="simple_textinput"
                placeholder={t("ent_step3_district_placeholder")}
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
                    <p>{t("back")}</p>
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
                    <p>{t("next")}</p>
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-4">
                  <ErrorBody error={error} />
                </div>
              )}
              <div className="mx-auto mt-8">
                <TextButton text={t("log_out")} action={logOut} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntrepreneurStepThree;
