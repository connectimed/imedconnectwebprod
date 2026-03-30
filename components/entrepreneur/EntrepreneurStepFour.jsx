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
import { useLanguage } from "@/lib/context/LanguageContext";

const EntrepreneurStepFour = ({ userData }) => {
  const { fetchUserData, logOut } = UserAuth();
  const { t } = useLanguage();

  const revenueRanges = [
    "Below TZS 500,000",
    "TZS 500,001 – 2,000,000",
    "TZS 2,000,001 – 5,000,000",
    "Above TZS 5,000,000",
  ];

  const challengeOptions = [
    { label: t("challenge_finance"),     value: "Access to finance" },
    { label: t("challenge_markets"),     value: "Markets" },
    { label: t("challenge_skills"),      value: "Skills" },
    { label: t("challenge_technology"),  value: "Technology" },
    { label: t("challenge_regulations"), value: "Regulations" },
    { label: t("challenge_climate"),     value: "Climate change" },
    { label: t("challenge_other"),       value: "Other" },
  ];

  const supportOptions = [
    { label: t("support_training"),   value: "Business training" },
    { label: t("support_mentorship"), value: "Mentorship" },
    { label: t("support_market"),     value: "Market linkages" },
    { label: t("support_finance"),    value: "Access to finance" },
    { label: t("support_networking"), value: "Networking" },
    { label: t("support_other"),      value: "Other" },
  ];
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
      setError(t("ent_step4_error_employees"));
      setTimeout(() => setError(""), 2000);
      return;
    }
    if (challenges.length < 1) {
      setError(t("ent_step4_error_challenges"));
      setTimeout(() => setError(""), 2000);
      return;
    }
    if (!receivedSupport) {
      setError(t("ent_step4_error_support"));
      setTimeout(() => setError(""), 2000);
      return;
    }
    if (receivedSupport === "Yes" && !supportOrg.trim()) {
      setError(t("ent_step4_error_support_org"));
      setTimeout(() => setError(""), 2000);
      return;
    }
    if (supportNeeded.length < 1) {
      setError(t("ent_step4_error_support_needed"));
      setTimeout(() => setError(""), 2000);
      return;
    }
    if (!disability) {
      setError(t("ent_step4_error_disability"));
      setTimeout(() => setError(""), 2000);
      return;
    }
    if (disability === "Yes" && !disabilityDesc.trim()) {
      setError(t("ent_step4_error_disability_desc"));
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
      setError(t("ent_step4_error_generic"));
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
      setError("Something went wrong. Please try again.");
      setTimeout(() => setError(""), 3000);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mx-auto bg-white rounded-lg pt-4 pb-10">
        <p className="text-heading3-bold px-6">{t("ent_step4_heading")}</p>
        <p className="text-small-regular text-gray-1 px-6">
          {t("ent_step4_subtitle")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 mt-4">
          <div className="flex flex-col px-6">
            <p className="mt-1 mb-2 text-gray-1 text-small-regular">
              {t("ent_step4_employees_label")}
            </p>
            <input
              type="text"
              className="simple_textinput"
              placeholder={t("ent_step4_employees_placeholder")}
              value={employees}
              onChange={handleEmployeesChange}
            />

            <p className="mt-5 mb-2 text-gray-1 text-small-regular">
              {t("ent_step4_revenue_label")}
            </p>
            <SingleOptionDropdown
              options={revenueRanges}
              selectedValue={revenue}
              onSelect={setRevenue}
            />

            <p className="mt-5 mb-2 text-gray-1 text-small-regular">
              {t("ent_step4_challenges_label")}
            </p>
            <MultipleCheckbox
              options={challengeOptions}
              selectedValues={challenges}
              onSelect={setChallenges}
            />

            <p className="mt-5 mb-2 text-gray-1 text-small-regular">
              {t("ent_step4_support_received_label")}
            </p>
            <ChoiceChips
              choices={[
                { label: t("yes"), value: "Yes" },
                { label: t("no"),  value: "No" },
              ]}
              selectedChoice={receivedSupport}
              onSelectChoice={setReceivedSupport}
            />
            {receivedSupport === "Yes" && (
              <>
                <p className="mt-4 mb-2 text-gray-1 text-small-regular">
                  {t("ent_step4_support_org_label")}
                </p>
                <input
                  type="text"
                  className="simple_textinput"
                  placeholder={t("ent_step4_support_org_placeholder")}
                  value={supportOrg}
                  onChange={handleSupportOrgChange}
                />
              </>
            )}
          </div>

          <div className="flex flex-col px-6">
            <p className="mt-5 md:mt-0 mb-2 text-gray-1 text-small-regular">
              {t("ent_step4_support_needed_label")}
            </p>
            <MultipleCheckbox
              options={supportOptions}
              selectedValues={supportNeeded}
              onSelect={setSupportNeeded}
            />

            <p className="mt-5 mb-2 text-gray-1 text-small-regular">
              {t("ent_step4_tin_label")}
            </p>
            <input
              type="text"
              className="simple_textinput"
              placeholder={t("ent_step4_tin_placeholder")}
              value={tin}
              onChange={handleTinChange}
            />

            <p className="mt-5 mb-2 text-gray-1 text-small-regular">
              {t("ent_step4_disability_label")}
            </p>
            <ChoiceChips
              choices={[
                { label: t("yes"), value: "Yes" },
                { label: t("no"),  value: "No" },
              ]}
              selectedChoice={disability}
              onSelectChoice={setDisability}
            />
            {disability === "Yes" && (
              <>
                <p className="mt-4 mb-2 text-gray-1 text-small-regular">
                  {t("ent_step4_disability_desc_label")}
                </p>
                <input
                  type="text"
                  className="simple_textinput"
                  placeholder={t("ent_step4_disability_desc_placeholder")}
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
                  <p>{t("submit")}</p>
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-5">
                <ErrorBody error={error} />
              </div>
            )}
            <div className="mx-auto mt-10">
              <TextButton text={t("log_out")} action={logOut} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntrepreneurStepFour;
