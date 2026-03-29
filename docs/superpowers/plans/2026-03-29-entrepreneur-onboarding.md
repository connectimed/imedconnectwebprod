# Entrepreneur / MSME Onboarding — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a third "Entrepreneur / MSME" account type to registration, with its own two-screen onboarding questionnaire that reuses existing Firestore fields.

**Architecture:** AccountDecider gains a third card; Guardian.jsx routes Entrepreneur users through StudentStepTwo (reused) then two new Entrepreneur-specific components; no new Firestore fields are introduced.

**Tech Stack:** Next.js 14 App Router, Firebase Firestore, React hooks, Tailwind CSS + DaisyUI, existing shared UI components (`ChoiceChips`, `MultipleCheckbox`, `SingleOptionDropdown`, `ErrorBody`, `TextButton`, `ProgressIndicator`).

---

## File Map

| Action | Path | What changes |
|---|---|---|
| Modify | `components/shared/AccountDecider.jsx` | Add Entrepreneur card + handle `"Entrepreneur"` selection |
| Modify | `components/shared/Guardian.jsx` | Add 3 routing conditions for Entrepreneur steps 2, 3, 4 |
| Create | `components/entrepreneur/EntrepreneurStepThree.jsx` | Q1–Q7 + Q12 (business profile + location) |
| Create | `components/entrepreneur/EntrepreneurStepFour.jsx` | Q8–Q13 + disability (financial + challenges + support) |

---

## Task 1: Add Entrepreneur option to AccountDecider

**Files:**
- Modify: `components/shared/AccountDecider.jsx`

### Context

`AccountDecider` renders two selectable cards (Student → `"Student"`, Mentor → `"Mentor"`). It saves `user_type` and advances `user_profile_setup_step` to `"2"`. We add a third card below the Mentor card.

The current JSX ends the cards block at line ~126, followed by the Next button. Insert the new card between the Mentor card and the Next button div.

- [ ] **Step 1: Add the Entrepreneur card**

In `components/shared/AccountDecider.jsx`, add the following block immediately after the closing `</div>` of the Mentor card (around line 126, before the `<div className="mx-auto mt-6">`):

```jsx
<div
  className={`flex flex-row border border-slate-300 rounded-lg py-2 px-3 mt-4 cursor-pointer ${
    selectedType === "Entrepreneur" ? "border-primary-light" : ""
  }`}
  onClick={() => handleSelectType("Entrepreneur")}
>
  <div className="">
    <p className=" text-small-regular font-bold text-black">
      Entrepreneur / MSME
    </p>
    <p className=" text-small-regular text-gray-600">
      Access resources and connect with support networks to grow your business.
    </p>
  </div>
  <Image
    className="h-4 w-4"
    src={
      selectedType === "Entrepreneur"
        ? "/icons/selected.svg"
        : "/icons/unselected.svg"
    }
    height={512}
    width={512}
    alt="icon"
  />
</div>
```

No other logic changes are needed — `saveData` already saves `selectedType` as-is, so `"Entrepreneur"` will be stored correctly.

- [ ] **Step 2: Verify the file lints cleanly**

```bash
cd /Users/frank/Desktop/Projects/IMEDConnect/imedconnectwebprod
npm run lint -- --file components/shared/AccountDecider.jsx
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/shared/AccountDecider.jsx
git commit -m "feat: add Entrepreneur/MSME option to AccountDecider"
```

---

## Task 2: Create EntrepreneurStepThree (business profile)

**Files:**
- Create: `components/entrepreneur/EntrepreneurStepThree.jsx`

### Context

This is the first Entrepreneur-specific questionnaire screen (step 3 → 4). It collects:
- Q1 Business Name → `user_highest_institution_name` (optional text)
- Q2 Type of Business/Sector → `user_preferred_sector_to_specialize` (single select chips)
- Q3 Agricultural value chain → `user_areas_of_expertise` (multi-checkbox, shown only when Q2 = "Agriculture")
- Q4 Main Activity / Core Business → `user_business_ownership_details` (textarea, required ≥ 10 chars)
- Q5 Formalization status → `user_business_is_formalized` (single select chips, required)
- Q6 Years of operation → `user_business_started` (single select dropdown, required)
- Q12 Region + District → `user_region` + `user_district` (text inputs, required ≥ 3 chars each)

Reuse the same two-column layout as existing step components (`bg-[#e2ecf5]` image panel left, white form panel right). Use `ProgressIndicator` with `currentStep={4}`.

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p /Users/frank/Desktop/Projects/IMEDConnect/imedconnectwebprod/components/entrepreneur
```

Create `components/entrepreneur/EntrepreneurStepThree.jsx` with the following content:

```jsx
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
```

- [ ] **Step 2: Verify the file lints cleanly**

```bash
cd /Users/frank/Desktop/Projects/IMEDConnect/imedconnectwebprod
npm run lint -- --file components/entrepreneur/EntrepreneurStepThree.jsx
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/entrepreneur/EntrepreneurStepThree.jsx
git commit -m "feat: add EntrepreneurStepThree (business profile questionnaire)"
```

---

## Task 3: Create EntrepreneurStepFour (financial + challenges)

**Files:**
- Create: `components/entrepreneur/EntrepreneurStepFour.jsx`

### Context

Second Entrepreneur questionnaire screen (step 4 → 6 = PendingAccount). Collects:
- Q7 Number of employees → `user_business_plan` (text input, required)
- Q8 Average Monthly Revenue → `user_monthly_income` (single select dropdown, required)
- Q9 Main Challenges → `user_areas_of_interest` (multi-checkbox, ≥ 1 required)
- Q10 Received training/support → `user_has_received_support` (Yes/No chips) + `user_mentorship_training_detail` (conditional text, required when Yes)
- Q11 Support needed from IMED Connect → `user_available_times` (multi-checkbox, ≥ 1 required)
- Q13 TIN / Registration Number → `user_current_mo` (optional text input)
- Disability → `user_has_disability` (Yes/No chips, required) + `user_disability_description` (conditional text, required when Yes)

On submit saves `user_profile_setup_step: "6"` → routes to PendingAccount.

- [ ] **Step 1: Create the file**

Create `components/entrepreneur/EntrepreneurStepFour.jsx` with the following content:

```jsx
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
```

- [ ] **Step 2: Verify the file lints cleanly**

```bash
cd /Users/frank/Desktop/Projects/IMEDConnect/imedconnectwebprod
npm run lint -- --file components/entrepreneur/EntrepreneurStepFour.jsx
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/entrepreneur/EntrepreneurStepFour.jsx
git commit -m "feat: add EntrepreneurStepFour (financial and challenges questionnaire)"
```

---

## Task 4: Wire Entrepreneur routing into Guardian

**Files:**
- Modify: `components/shared/Guardian.jsx`

### Context

`Guardian.jsx` is a function (not a component) that returns JSX based on `userData.user_type` and `userData.user_profile_setup_step`. New conditions must be added for the Entrepreneur type at steps 2, 3, and 4. Step 2 reuses `StudentStepTwo` — no changes to that file needed.

Add the three new imports at the top of the file and three new routing blocks inside the function body.

- [ ] **Step 1: Add imports**

At the top of `components/shared/Guardian.jsx`, after the existing imports, add:

```js
import EntrepreneurStepThree from "../entrepreneur/EntrepreneurStepThree";
import EntrepreneurStepFour from "../entrepreneur/EntrepreneurStepFour";
```

- [ ] **Step 2: Add routing conditions**

Inside the `Guardian` function, after the Mentor step 5 block (around line 111, just before the `// Step six` comment), add:

```js
//  Entrepreneur step two (reuses StudentStepTwo — same basic info needed)
if (
  userData &&
  firebaseUser &&
  userData.user_type == "Entrepreneur" &&
  userData.user_profile_setup_step == "2"
) {
  return <StudentStepTwo userData={userData} />;
}

//  Entrepreneur step three
if (
  userData &&
  firebaseUser &&
  userData.user_type == "Entrepreneur" &&
  userData.user_profile_setup_step == "3"
) {
  return <EntrepreneurStepThree userData={userData} />;
}

//  Entrepreneur step four
if (
  userData &&
  firebaseUser &&
  userData.user_type == "Entrepreneur" &&
  userData.user_profile_setup_step == "4"
) {
  return <EntrepreneurStepFour userData={userData} />;
}
```

- [ ] **Step 3: Verify the file lints cleanly**

```bash
cd /Users/frank/Desktop/Projects/IMEDConnect/imedconnectwebprod
npm run lint -- --file components/shared/Guardian.jsx
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/shared/Guardian.jsx
git commit -m "feat: route Entrepreneur users through onboarding steps in Guardian"
```

---

## Task 5: Smoke test the full Entrepreneur flow

No automated test suite exists. Verify manually using the dev server.

- [ ] **Step 1: Start the dev server**

```bash
cd /Users/frank/Desktop/Projects/IMEDConnect/imedconnectwebprod
npm run dev
```

- [ ] **Step 2: Register a new test account**

Go to `/register`. Create a new account with a test phone number.

- [ ] **Step 3: Verify AccountDecider shows three options**

After OTP verification (step 1), the AccountDecider screen should show three cards: Youth Graduate, Mentor, Entrepreneur / MSME. Select **Entrepreneur / MSME** and press Next.

Expected: `user_type = "Entrepreneur"`, `user_profile_setup_step = "2"` saved in Firestore.

- [ ] **Step 4: Verify Step 2 (basic info)**

The StudentStepTwo screen (date of birth, sex, alt phone, email) should appear. Complete it and press Next.

Expected: `user_profile_setup_step = "3"` saved.

- [ ] **Step 5: Verify EntrepreneurStepThree**

The business profile screen should appear with all fields:
- Business name input (optional)
- Sector chips — select "Agriculture" → agri value chain checkboxes should appear
- Main activity textarea
- Formalization chips
- Years of operation dropdown
- Region + District inputs

Complete all required fields and press Next.

Expected: `user_profile_setup_step = "4"` saved, all field values present in Firestore.

- [ ] **Step 6: Verify EntrepreneurStepFour**

The financial + challenges screen should appear. Verify:
- Employees input
- Revenue dropdown
- Challenges checkboxes
- Received support Yes/No — select Yes → org input should appear
- Support needed checkboxes
- TIN input (optional)
- Disability Yes/No — select Yes → description input should appear

Complete all required fields and press Submit.

Expected: `user_profile_setup_step = "6"` saved → PendingAccount screen shown.

- [ ] **Step 7: Verify existing flows are unaffected**

Register two more test accounts. Select **Youth Graduate** on one, **Mentor** on the other. Confirm they each proceed through their original step sequences without any change in behaviour.

- [ ] **Step 8: Commit smoke test sign-off**

No code change. If any issue was found and fixed in this task, commit the fix:

```bash
git add <changed files>
git commit -m "fix: <describe what was fixed during smoke test>"
```

---

## Spec Coverage Check

| Spec requirement | Task |
|---|---|
| Third account type "Entrepreneur / MSME" in AccountDecider | Task 1 |
| `user_type: "Entrepreneur"` stored in Firestore | Task 1 (saveData passes selectedType) |
| Questionnaire routing by account type | Task 4 |
| Youth Graduate → existing flow unchanged | Task 5 step 7 |
| Mentor → existing flow unchanged | Task 5 step 7 |
| Entrepreneur → skip Youth Graduate questionnaire | Task 4 (steps 3+4 are Entrepreneur-only) |
| Q1–Q7 + Q12 on screen 1 | Task 2 |
| Q8–Q13 + disability on screen 2 | Task 3 |
| All 13 questions mapped to existing Firestore fields | Tasks 2, 3 (field names match spec table) |
| No new Firestore fields introduced | Tasks 2, 3 |
| Step 2 reuses StudentStepTwo | Task 4 |
| Entrepreneur step 4 → PendingAccount (step 6) | Task 3 (saves step "6") |
| OTP fix deferred | Out of scope |
| Bilingual support deferred | Out of scope |
