# Dual Language Support (English / Swahili) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add English/Swahili language switching to auth pages and account setup step components, with a pill toggle in `FunderLogo` and language persisted in `localStorage`.

**Architecture:** A `LanguageContext` (React Context + localStorage) wraps both the auth and root layouts, exposing `{ lang, setLang, t }`. All 13 targeted components call `useLanguage()` and replace hardcoded strings with `t("key")`. Choice components (`ChoiceChips`, `MultipleCheckbox`, `Interests`, `SingleOptionDropdown`) get a backward-compatible `{ label, value }` upgrade so display labels are translated but stored Firestore values remain English.

**Tech Stack:** Next.js 14 App Router, React Context, localStorage, Tailwind CSS / DaisyUI

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `lib/translations/index.js` | All `en`/`sw` string pairs |
| Create | `lib/context/LanguageContext.js` | Provider + `useLanguage()` hook |
| Create | `components/shared/LanguageToggle.jsx` | Pill toggle UI |
| Modify | `components/shared/ChoiceChips.jsx` | `{ label, value }` support |
| Modify | `components/shared/MultipleCheckbox.jsx` | `{ label, value }` support |
| Modify | `components/mentor/Interests.jsx` | `{ label, value }` support |
| Modify | `components/shared/SingleOptionDropdown.jsx` | `{ label, value }` support |
| Modify | `components/shared/FunderLogo.jsx` | Add `<LanguageToggle />` + translate text |
| Modify | `app/(auth)/layout.jsx` | Wrap with `<LanguageProvider>` |
| Modify | `app/(root)/layout.js` | Wrap with `<LanguageProvider>` |
| Modify | `app/(auth)/sign-in/page.jsx` | Replace hardcoded strings |
| Modify | `app/(auth)/register/page.jsx` | Replace hardcoded strings |
| Modify | `app/(auth)/reset/page.jsx` | Replace hardcoded strings |
| Modify | `components/student/StudentStepTwo.jsx` | Replace hardcoded strings |
| Modify | `components/mentor/MentorStepTwo.jsx` | Replace hardcoded strings |
| Modify | `components/student/StudentStepThree.jsx` | Replace hardcoded strings |
| Modify | `components/mentor/MentorStepThree.jsx` | Replace hardcoded strings |
| Modify | `components/student/StudentStepFour.jsx` | Replace hardcoded strings |
| Modify | `components/mentor/MentorStepFour.jsx` | Replace hardcoded strings |
| Modify | `components/student/StudentStepFive.jsx` | Replace hardcoded strings |
| Modify | `components/mentor/MentorStepFive.jsx` | Replace hardcoded strings |
| Modify | `components/entrepreneur/EntrepreneurStepThree.jsx` | Replace hardcoded strings |
| Modify | `components/entrepreneur/EntrepreneurStepFour.jsx` | Replace hardcoded strings |

---

### Task 1: Upgrade shared selection components with `{ label, value }` support

These 4 components currently accept arrays of strings. We add backward-compatible support for `{ label, value }` objects so translated labels can be shown while English values are stored in Firestore.

**Files:**
- Modify: `components/shared/ChoiceChips.jsx`
- Modify: `components/shared/MultipleCheckbox.jsx`
- Modify: `components/mentor/Interests.jsx`
- Modify: `components/shared/SingleOptionDropdown.jsx`

- [ ] **Step 1: Update `ChoiceChips.jsx`**

Replace the entire file with:

```jsx
import React from "react";

const ChoiceChips = ({ choices, selectedChoice, onSelectChoice }) => {
  const getLabel = (c) => (typeof c === "object" ? c.label : c);
  const getValue = (c) => (typeof c === "object" ? c.value : c);

  return (
    <div className="flex flex-wrap gap-2">
      {choices.map((choice, index) => (
        <div
          key={index}
          className={`px-4 py-1.5 border rounded-full cursor-pointer text-small-regular tracking-wide ${
            selectedChoice === getValue(choice)
              ? "bg-primary-light text-white"
              : "bg-gray-200 text-gray-500"
          }`}
          onClick={() => onSelectChoice(getValue(choice))}
        >
          {getLabel(choice)}
        </div>
      ))}
    </div>
  );
};

export default ChoiceChips;
```

- [ ] **Step 2: Update `MultipleCheckbox.jsx`**

Replace the entire file with:

```jsx
import Image from "next/image";
import React, { useState } from "react";

const MultipleCheckbox = ({ options, selectedValues, onSelect }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getLabel = (o) => (typeof o === "object" ? o.label : o);
  const getValue = (o) => (typeof o === "object" ? o.value : o);

  const handleSelection = (value) => {
    if (selectedValues.includes(value)) {
      onSelect(selectedValues.filter((item) => item !== value));
    } else {
      onSelect([...selectedValues, value]);
    }
  };

  return (
    <div className="relative">
      <div
        className="w-full py-2 bg-transparent border rounded-md border-gray-300 px-4 text-slate-700 focus:border-primary-light placeholder:text-slate-400 text-small-regular outline-none tracking-wide cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {selectedValues.length > 0
          ? selectedValues.join(", ")
          : "Select one or more items"}
      </div>
      {isDropdownOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-slate-300 rounded-lg shadow-lg text-small-regular max-h-48 overflow-scroll">
          {options.map((option) => (
            <li
              key={getValue(option)}
              onClick={() => handleSelection(getValue(option))}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
            >
              <div className="flex flex-row space-x-2 items-center">
                <Image
                  className="h-4 w-4"
                  src={
                    selectedValues.includes(getValue(option))
                      ? "/icons/checked.svg"
                      : "/icons/unchecked.svg"
                  }
                  height={512}
                  width={512}
                  alt="icon"
                />
                <p>{getLabel(option)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultipleCheckbox;
```

- [ ] **Step 3: Update `Interests.jsx`**

Replace the entire file with:

```jsx
import React, { useState } from "react";

const Interests = ({ options, selectedValue, onSelect }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getLabel = (o) => (typeof o === "object" ? o.label : o);
  const getValue = (o) => (typeof o === "object" ? o.value : o);

  const getSelectedLabel = () => {
    if (!selectedValue) return "";
    const match = options.find((o) => getValue(o) === selectedValue);
    return match ? getLabel(match) : selectedValue;
  };

  const handleSelection = (option) => {
    onSelect(getValue(option));
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <div
        className="w-full py-2 bg-transparent border rounded-md border-gray-300 px-4 text-slate-700 focus:border-primary-light placeholder:text-slate-400 text-small-regular outline-none tracking-wide cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {getSelectedLabel()}
      </div>
      {isDropdownOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-slate-300 rounded-lg shadow-lg text-small-regular max-h-48 overflow-scroll">
          {options.map((option) => (
            <li
              key={getValue(option)}
              onClick={() => handleSelection(option)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
            >
              {getLabel(option)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Interests;
```

- [ ] **Step 4: Update `SingleOptionDropdown.jsx`**

Replace the entire file with:

```jsx
import React, { useState, useEffect, useRef } from "react";

const SingleOptionDropdown = ({ label, options, selectedValue, onSelect }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getLabel = (o) => (typeof o === "object" ? o.label : o);
  const getValue = (o) => (typeof o === "object" ? o.value : o);

  const getSelectedLabel = () => {
    if (!selectedValue) return label || "";
    const match = options.find((o) => getValue(o) === selectedValue);
    return match ? getLabel(match) : selectedValue;
  };

  const handleSelection = (option) => {
    onSelect(getValue(option));
    setIsDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="w-full py-2 bg-transparent border rounded-md border-gray-300 px-4 text-slate-700 focus:border-primary-light placeholder:text-slate-400 text-small-regular outline-none tracking-wide cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {getSelectedLabel()}
      </div>
      {isDropdownOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-slate-300 rounded-lg shadow-lg text-small-regular max-h-48 overflow-scroll">
          {options.map((option) => (
            <li
              key={getValue(option)}
              onClick={() => handleSelection(option)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
            >
              {getLabel(option)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SingleOptionDropdown;
```

- [ ] **Step 5: Verify existing pages still work**

Run `npm run dev`, open any page that uses these components (e.g. a setup step page). Confirm chips render and select normally — no visual regressions.

- [ ] **Step 6: Commit**

```bash
git add components/shared/ChoiceChips.jsx components/shared/MultipleCheckbox.jsx components/mentor/Interests.jsx components/shared/SingleOptionDropdown.jsx
git commit -m "feat: add {label,value} support to selection components for i18n"
```

---

### Task 2: Create `lib/translations/index.js`

**Files:**
- Create: `lib/translations/index.js`

- [ ] **Step 1: Create the file**

```js
const translations = {
  en: {
    // ── Common ──────────────────────────────────────────────────────────────
    back: "Back",
    next: "Next",
    submit: "Submit",
    log_out: "Log Out",
    yes: "Yes",
    no: "No",
    male: "Male",
    female: "Female",
    description_placeholder: "Description",
    other: "Other",

    // ── FunderLogo ───────────────────────────────────────────────────────────
    funder_text:
      "The IMED Connect project is funded by the Finnish Embassy.",

    // ── Auth shared ──────────────────────────────────────────────────────────
    app_tagline: "Also available on android and ios.",
    phone_number: "Phone number",
    password: "Password",
    sign_in: "Sign In",
    register: "Register",

    // ── Sign-in page ─────────────────────────────────────────────────────────
    signin_subtitle: "Sign In",
    forgot_password: "Forgot password?",
    not_a_member: "Not a member?",
    signin_error_fill: "Please fill everything!",
    signin_error_credentials: "Incorrect credentials!",

    // ── Register page ────────────────────────────────────────────────────────
    register_subtitle: "Register",
    your_name: "Your name",
    register_btn: "Register Now",
    already_member: "Already a member?",
    register_error_name: "Enter your full name!",
    register_error_phone: "Enter a valid phone number!",
    register_error_phone_zero: "Phone shouldn't start with 0!",
    register_error_password: "Enter a strong password!",
    register_error_phone_in_use: "Phone number already in use.",
    register_error_generic: "Error! Check and try again.",

    // ── Reset page ───────────────────────────────────────────────────────────
    reset_subtitle: "Reset password",
    six_digits_code: "Six digits code",
    send_otp: "Send OTP",
    ready_to_continue: "Ready to continue?",
    reset_error_phone: "Enter valid phone number!",
    reset_error_wrong_code: "Wrong code",

    // ── Step 2 — shared by StudentStepTwo and MentorStepTwo ─────────────────
    step2_heading: "Tell us about you!",
    step2_dob_question: "What is your date of birth?",
    step2_sex_question: "Please tell us your sex.",
    step2_alt_phone_label: "Your alternative phone number",
    step2_alt_phone_placeholder: "Eg: 255** *** ***",
    step2_email_label: "Your email address",
    step2_email_placeholder: "Email address",
    step2_error_dob: "Please enter a valid date of birth",
    step2_error_sex: "Please select your sex",
    step2_error_phone: "Please enter a valid phone number.",
    step2_error_email: "Please enter a valid email address.",

    // ── Marital status chips ─────────────────────────────────────────────────
    marital_single: "Single",
    marital_married: "Married",
    marital_separated: "Separated",
    marital_widowed: "Widowed",

    // ── Student Step 3 ───────────────────────────────────────────────────────
    student_step3_heading: "Tell us more!",
    student_step3_marital_question: "What is your marital status?",
    student_step3_location_question: "Please tell us your location.",
    student_step3_location_placeholder: "Eg: Dar Es Salaam, Kinondoni",
    student_step3_error_marital: "Please select your marital status",
    student_step3_error_location: "Please enter a valid location",

    // ── Student Step 4 ───────────────────────────────────────────────────────
    student_step4_heading: "Tell us your education.",
    student_step4_level_question: "What's your highest level of education?",
    student_step4_level_label: "Your highest level of education?",
    student_step4_course_question:
      "Course or program for your highest education level?",
    student_step4_course_placeholder: "Eg: Bachelor Degree in Linguistic",
    student_step4_institution_question:
      "Name of the institution for your highest education level?",
    student_step4_institution_placeholder: "Eg: University Of Dar Es Salaam",
    student_step4_year_question: "Which year did you graduate?",
    student_step4_error_field: "Please enter field of study",
    student_step4_error_institution: "Please enter a valid institution",
    student_step4_error_year: "Please select graduation year",

    // ── Student Step 5 ───────────────────────────────────────────────────────
    student_step5_heading: "Tell us your preference.",
    student_step5_sector_question:
      "Which sector do you prefer to specialize in your career endeavors?",
    student_step5_timing_question:
      "What is your most preferred timing for providing mentorship support to the beneficiaries? ( pick option you mostly prefer )",
    student_step5_device_question:
      "Which devices do you use to access online information?",
    student_step5_error_device: "Please select device.",

    // ── Sector chips (StudentStepFive) ───────────────────────────────────────
    sector_agriculture: "Agriculture, Agribusiness or Agro-processing",
    sector_transport: "Transport and Logistics",
    sector_tourism: "Tourism and Hospitality",
    sector_construction: "Construction",
    sector_ict: "Information and Communication Technology",
    sector_agroforestry: "Agroforestry",
    sector_energy: "Energy",
    sector_other: "Other",

    // ── Device chips ─────────────────────────────────────────────────────────
    device_smartphone: "Smartphone",
    device_computer: "Computer",
    device_tablet: "Tablet",
    device_none: "None",

    // ── Timing checkboxes ────────────────────────────────────────────────────
    timing_anytime: "Anytime during working hours",
    timing_morning_weekday: "Morning on weekdays",
    timing_afternoon_weekday: "Afternoon on weekdays",
    timing_evening_weekday: "Evening on weekdays",
    timing_morning_weekend: "Morning on weekends",
    timing_afternoon_weekend: "Afternoon on weekends",
    timing_evening_weekend: "Evening on weekends",

    // ── Mentor Step 3 ────────────────────────────────────────────────────────
    mentor_step3_heading: "Tell us more!",
    mentor_step3_level_question: "What's your highest level of education?",
    mentor_step3_level_label: "Your highest level of education?",
    mentor_step3_field_question: "What is your highest field of study?",
    mentor_step3_field_placeholder: "Eg: Bachelor Degree in Linguistic",
    mentor_step3_location_question: "Please tell us your location.",
    mentor_step3_location_placeholder: "Eg: Dar Es Salaam, Kinondoni",
    mentor_step3_error_field: "Please enter field of study",
    mentor_step3_error_location: "Please enter a valid location",

    // ── Mentor Step 4 ────────────────────────────────────────────────────────
    mentor_step4_heading: "Tell us about your skills.",
    mentor_step4_training_question:
      "Have you attended any professional training in coaching and mentorship skills? If yes, please describe the details.",
    mentor_step4_training_detail_label:
      "Provide details of the training ( course, award, year)",
    mentor_step4_experience_question:
      "Do you have any experience in business or career coaching? If Yes, please indicate for how long and in what areas.",
    mentor_step4_experience_detail_label:
      "Please describe your experience and the area of experience.",
    mentor_step4_error_training: "Please select training status",
    mentor_step4_error_training_detail: "Please detail the training",
    mentor_step4_error_experience: "Please select experience status",
    mentor_step4_error_experience_detail: "Please detail your experience",

    // ── Mentor Step 5 ────────────────────────────────────────────────────────
    mentor_step5_heading: "Tell us your preferences.",
    mentor_step5_interest_question:
      "Select major  areas of interest in coaching and mentorship",
    mentor_step5_expertise_question:
      "Select specific areas  of expertise (Tick all that apply)",
    mentor_step5_number_question:
      "How many mentees can you handle efficiently in a given time?",
    mentor_step5_timing_question:
      "What is your most preferred timing for providing mentorship support to the beneficiaries? ( pick option you mostly prefer )",
    mentor_step5_error_expertise:
      "Please select atleast one area of expertise.",

    // ── Mentor interests ─────────────────────────────────────────────────────
    interest_business: "Business Development and Entrepreneurship",
    interest_career: "Early Career Development and Counselling",
    interest_both: "Both areas",

    // ── Mentor mentee count ──────────────────────────────────────────────────
    mentee_one: "Just one",
    mentee_2_5: "2 - 5",
    mentee_5_10: "5 - 10",
    mentee_10_20: "10 - 20",
    mentee_20_50: "20 - 50",
    mentee_50_plus: "50 and above",

    // ── Expertise areas (Mentor Step 5) ──────────────────────────────────────
    expertise_entrepreneurship: "Entrepreneurship development",
    expertise_finance: "Financial management and literacy",
    expertise_investor: "Investor readiness",
    expertise_biz_mgmt: "Business Management Strategy and Governance",
    expertise_biz_model: "Business Modelling and Design thinking",
    expertise_job_search: "Job searching skills",
    expertise_marketing: "Marketing and selling skills",
    expertise_online_gigs: "Online Gigs and Remote jobs",
    expertise_communication: "Communication and Relationship building",
    expertise_fundraising: "Fundraising and resource mobilization",
    expertise_digital: "Digital Skills",
    expertise_innovation: "Innovation Management",
    expertise_other: "Other",

    // ── Entrepreneur Step 3 ──────────────────────────────────────────────────
    ent_step3_heading: "Tell us about your business.",
    ent_step3_subtitle:
      "Help us understand your work so we can connect you with the right support.",
    ent_step3_biz_name_label: "Business name (if applicable)",
    ent_step3_biz_name_placeholder: "Eg: Kilimo Fresh Ltd",
    ent_step3_sector_label: "Type of business / sector",
    ent_step3_value_chain_question:
      "Which agricultural value chain do you work with?",
    ent_step3_activity_label:
      "Main activity / core business — describe your main product or service",
    ent_step3_activity_placeholder:
      "Eg: Selling fresh vegetables directly to households in Dar es Salaam",
    ent_step3_formalization_label: "Is your business formalized / registered?",
    ent_step3_years_label: "Years of business operation",
    ent_step3_region_label: "Region where your business operates",
    ent_step3_region_placeholder: "Eg: Arusha",
    ent_step3_district_label: "District where your business operates",
    ent_step3_district_placeholder: "Eg: Arumeru",
    ent_step3_error_sector: "Please select your type of business.",
    ent_step3_error_activity:
      "Please describe your main business activity (at least 10 characters).",
    ent_step3_error_formalization:
      "Please select your business formalization status.",
    ent_step3_error_region: "Please enter your business region.",
    ent_step3_error_district: "Please enter your business district.",
    ent_step3_error_generic: "Something went wrong. Please try again.",

    // ── Entrepreneur sectors ─────────────────────────────────────────────────
    ent_sector_agriculture: "Agriculture",
    ent_sector_livestock: "Livestock",
    ent_sector_fishing: "Fishing",
    ent_sector_processing: "Processing",
    ent_sector_services: "Services",
    ent_sector_trade: "Trade",
    ent_sector_other: "Other",

    // ── Agricultural value chains ────────────────────────────────────────────
    vc_maize: "Maize",
    vc_rice: "Rice",
    vc_sunflower: "Sunflower",
    vc_horticulture: "Horticulture (vegetables & fruits)",
    vc_poultry: "Poultry",
    vc_livestock: "Animal Keeping (livestock)",
    vc_cassava: "Cassava",
    vc_beans: "Beans",
    vc_other: "Other",

    // ── Formalization options ────────────────────────────────────────────────
    form_not_registered: "Not registered",
    form_brela: "Registered through BRELA",
    form_other: "Other Registrations (e.g. local authority, cooperative)",
    form_no_business: "I have no business",

    // ── Years of operation ───────────────────────────────────────────────────
    years_less_1: "Less than 1 year",
    years_1_3: "1–3 years",
    years_4_5: "4–5 years",
    years_more_5: "More than 5 years",

    // ── Entrepreneur Step 4 ──────────────────────────────────────────────────
    ent_step4_heading: "Your Business Details",
    ent_step4_subtitle:
      "This information helps us tailor support and resources to your specific needs. All information remains confidential.",
    ent_step4_employees_label: "Number of employees (including yourself)",
    ent_step4_employees_placeholder: "Eg: 3",
    ent_step4_revenue_label: "Average monthly revenue (in TZS)",
    ent_step4_challenges_label:
      "Main challenges currently facing your business (select all that apply)",
    ent_step4_support_received_label:
      "Have you received any business training or support before?",
    ent_step4_support_org_label: "From which organisation or project?",
    ent_step4_support_org_placeholder: "Eg: TangaYetu, AGRA",
    ent_step4_support_needed_label:
      "What kind of support are you looking for from IMED Connect? (select all that apply)",
    ent_step4_tin_label: "TIN / Business Registration Number (optional)",
    ent_step4_tin_placeholder: "Eg: 123-456-789",
    ent_step4_disability_label: "Do you have any form of disability?",
    ent_step4_disability_desc_label: "Please describe your disability",
    ent_step4_disability_desc_placeholder: "Describe",
    ent_step4_error_employees: "Please enter the number of employees.",
    ent_step4_error_challenges: "Please select at least one main challenge.",
    ent_step4_error_support:
      "Please indicate whether you have received business support before.",
    ent_step4_error_support_org:
      "Please name the organisation or project that provided support.",
    ent_step4_error_support_needed:
      "Please select at least one type of support you are looking for.",
    ent_step4_error_disability:
      "Please indicate whether you have any form of disability.",
    ent_step4_error_disability_desc: "Please describe your disability.",
    ent_step4_error_generic: "Something went wrong. Please try again.",

    // ── Revenue ranges ───────────────────────────────────────────────────────
    revenue_below_500k: "Below TZS 500,000",
    revenue_500k_2m: "TZS 500,001 – 2,000,000",
    revenue_2m_5m: "TZS 2,000,001 – 5,000,000",
    revenue_above_5m: "Above TZS 5,000,000",

    // ── Business challenges ──────────────────────────────────────────────────
    challenge_finance: "Access to finance",
    challenge_markets: "Markets",
    challenge_skills: "Skills",
    challenge_technology: "Technology",
    challenge_regulations: "Regulations",
    challenge_climate: "Climate change",
    challenge_other: "Other",

    // ── Support types ────────────────────────────────────────────────────────
    support_training: "Business training",
    support_mentorship: "Mentorship",
    support_market: "Market linkages",
    support_finance: "Access to finance",
    support_networking: "Networking",
    support_other: "Other",
  },

  sw: {
    // ── Common ──────────────────────────────────────────────────────────────
    back: "Rudi",
    next: "Endelea",
    submit: "Wasilisha",
    log_out: "Toka",
    yes: "Ndiyo",
    no: "Hapana",
    male: "Mme",
    female: "Mke",
    description_placeholder: "Maelezo",
    other: "Nyingine",

    // ── FunderLogo ───────────────────────────────────────────────────────────
    funder_text:
      "Mradi wa IMED Connect unafadhiliwa na Ubalozi wa Finland.",

    // ── Auth shared ──────────────────────────────────────────────────────────
    app_tagline: "Inapatikana pia kwenye android na ios.",
    phone_number: "Nambari ya simu",
    password: "Nenosiri",
    sign_in: "Ingia",
    register: "Jiandikishe",

    // ── Sign-in page ─────────────────────────────────────────────────────────
    signin_subtitle: "Ingia",
    forgot_password: "Umesahau nenosiri?",
    not_a_member: "Bado si mwanachama?",
    signin_error_fill: "Tafadhali jaza kila kitu!",
    signin_error_credentials: "Taarifa za kuingia si sahihi!",

    // ── Register page ────────────────────────────────────────────────────────
    register_subtitle: "Jiandikishe",
    your_name: "Jina lako",
    register_btn: "Jiandikishe Sasa",
    already_member: "Tayari ni mwanachama?",
    register_error_name: "Weka jina lako kamili!",
    register_error_phone: "Weka nambari sahihi ya simu!",
    register_error_phone_zero: "Nambari ya simu isianze na 0!",
    register_error_password: "Weka nenosiri imara!",
    register_error_phone_in_use: "Nambari ya simu tayari inatumika.",
    register_error_generic: "Hitilafu! Angalia na jaribu tena.",

    // ── Reset page ───────────────────────────────────────────────────────────
    reset_subtitle: "Weka upya nenosiri",
    six_digits_code: "Msimbo wa nambari sita",
    send_otp: "Tuma OTP",
    ready_to_continue: "Uko tayari kuendelea?",
    reset_error_phone: "Weka nambari sahihi ya simu!",
    reset_error_wrong_code: "Msimbo usio sahihi",

    // ── Step 2 ───────────────────────────────────────────────────────────────
    step2_heading: "Tuambie kuhusu wewe!",
    step2_dob_question: "Tarehe yako ya kuzaliwa ni nini?",
    step2_sex_question: "Tafadhali tuambie jinsia yako.",
    step2_alt_phone_label: "Nambari yako mbadala ya simu",
    step2_alt_phone_placeholder: "Mfano: 255** *** ***",
    step2_email_label: "Anwani yako ya barua pepe",
    step2_email_placeholder: "Anwani ya barua pepe",
    step2_error_dob: "Tafadhali weka tarehe sahihi ya kuzaliwa",
    step2_error_sex: "Tafadhali chagua jinsia yako",
    step2_error_phone: "Tafadhali weka nambari sahihi ya simu.",
    step2_error_email: "Tafadhali weka anwani sahihi ya barua pepe.",

    // ── Marital status chips ─────────────────────────────────────────────────
    marital_single: "Mseja",
    marital_married: "Mwenye ndoa",
    marital_separated: "Ametengana",
    marital_widowed: "Mjane",

    // ── Student Step 3 ───────────────────────────────────────────────────────
    student_step3_heading: "Tuambie zaidi!",
    student_step3_marital_question: "Hali yako ya ndoa ni nini?",
    student_step3_location_question: "Tafadhali tuambie mahali ulipo.",
    student_step3_location_placeholder: "Mfano: Dar Es Salaam, Kinondoni",
    student_step3_error_marital: "Tafadhali chagua hali yako ya ndoa",
    student_step3_error_location: "Tafadhali weka mahali sahihi",

    // ── Student Step 4 ───────────────────────────────────────────────────────
    student_step4_heading: "Tuambie elimu yako.",
    student_step4_level_question:
      "Kiwango chako cha juu zaidi cha elimu ni nini?",
    student_step4_level_label: "Kiwango chako cha juu zaidi cha elimu?",
    student_step4_course_question:
      "Kozi au programu ya kiwango chako cha juu zaidi cha elimu?",
    student_step4_course_placeholder: "Mfano: Shahada ya Kwanza ya Isimu",
    student_step4_institution_question:
      "Jina la taasisi ya kiwango chako cha juu zaidi cha elimu?",
    student_step4_institution_placeholder:
      "Mfano: Chuo Kikuu cha Dar Es Salaam",
    student_step4_year_question: "Ulihitimu mwaka gani?",
    student_step4_error_field: "Tafadhali weka uwanja wa masomo",
    student_step4_error_institution: "Tafadhali weka taasisi sahihi",
    student_step4_error_year: "Tafadhali chagua mwaka wa kuhitimu",

    // ── Student Step 5 ───────────────────────────────────────────────────────
    student_step5_heading: "Tuambie mapendeleo yako.",
    student_step5_sector_question:
      "Unapendelea kufanya kazi katika sekta gani?",
    student_step5_timing_question:
      "Muda gani unaofaa zaidi kwako kupata msaada wa ushauri? ( chagua unaopendelea zaidi )",
    student_step5_device_question:
      "Unatumia vifaa gani kupata taarifa mtandaoni?",
    student_step5_error_device: "Tafadhali chagua kifaa.",

    // ── Sector chips ─────────────────────────────────────────────────────────
    sector_agriculture: "Kilimo, Biashara ya Kilimo au Usindikaji",
    sector_transport: "Usafiri na Usafirishaji",
    sector_tourism: "Utalii na Ukarimu",
    sector_construction: "Ujenzi",
    sector_ict: "Teknolojia ya Habari na Mawasiliano",
    sector_agroforestry: "Kilimo Misitu",
    sector_energy: "Nishati",
    sector_other: "Nyingine",

    // ── Device chips ─────────────────────────────────────────────────────────
    device_smartphone: "Simu ya kisasa",
    device_computer: "Kompyuta",
    device_tablet: "Kompyuta kibao",
    device_none: "Hakuna",

    // ── Timing checkboxes ────────────────────────────────────────────────────
    timing_anytime: "Wakati wowote wa saa za kazi",
    timing_morning_weekday: "Asubuhi siku za kazi",
    timing_afternoon_weekday: "Mchana siku za kazi",
    timing_evening_weekday: "Jioni siku za kazi",
    timing_morning_weekend: "Asubuhi wikendi",
    timing_afternoon_weekend: "Mchana wikendi",
    timing_evening_weekend: "Jioni wikendi",

    // ── Mentor Step 3 ────────────────────────────────────────────────────────
    mentor_step3_heading: "Tuambie zaidi!",
    mentor_step3_level_question:
      "Kiwango chako cha juu zaidi cha elimu ni nini?",
    mentor_step3_level_label: "Kiwango chako cha juu zaidi cha elimu?",
    mentor_step3_field_question: "Uwanja wako wa juu zaidi wa masomo ni nini?",
    mentor_step3_field_placeholder: "Mfano: Shahada ya Kwanza ya Isimu",
    mentor_step3_location_question: "Tafadhali tuambie mahali ulipo.",
    mentor_step3_location_placeholder: "Mfano: Dar Es Salaam, Kinondoni",
    mentor_step3_error_field: "Tafadhali weka uwanja wa masomo",
    mentor_step3_error_location: "Tafadhali weka mahali sahihi",

    // ── Mentor Step 4 ────────────────────────────────────────────────────────
    mentor_step4_heading: "Tuambie kuhusu ujuzi wako.",
    mentor_step4_training_question:
      "Je, umewahi kupata mafunzo ya kitaalamu ya ukocha na ushauri? Kama ndiyo, tafadhali eleza maelezo.",
    mentor_step4_training_detail_label:
      "Toa maelezo ya mafunzo ( kozi, tuzo, mwaka)",
    mentor_step4_experience_question:
      "Je, una uzoefu wowote katika ukocha wa biashara au kazi? Kama ndiyo, onyesha kwa muda gani na katika maeneo gani.",
    mentor_step4_experience_detail_label:
      "Tafadhali eleza uzoefu wako na eneo la uzoefu.",
    mentor_step4_error_training: "Tafadhali chagua hali ya mafunzo",
    mentor_step4_error_training_detail: "Tafadhali eleza mafunzo",
    mentor_step4_error_experience: "Tafadhali chagua hali ya uzoefu",
    mentor_step4_error_experience_detail: "Tafadhali eleza uzoefu wako",

    // ── Mentor Step 5 ────────────────────────────────────────────────────────
    mentor_step5_heading: "Tuambie mapendeleo yako.",
    mentor_step5_interest_question:
      "Chagua maeneo makuu ya kupenda katika ukocha na ushauri",
    mentor_step5_expertise_question:
      "Chagua maeneo mahususi ya utaalamu (Weka alama zote zinazofaa)",
    mentor_step5_number_question:
      "Unaweza kushughulikia wanafunzi wangapi kwa ufanisi kwa wakati fulani?",
    mentor_step5_timing_question:
      "Muda gani unaofaa zaidi kwako kutoa msaada wa ushauri kwa wanufaika? ( chagua unaopendelea zaidi )",
    mentor_step5_error_expertise:
      "Tafadhali chagua angalau eneo moja la utaalamu.",

    // ── Mentor interests ─────────────────────────────────────────────────────
    interest_business: "Maendeleo ya Biashara na Ujasiriamali",
    interest_career: "Maendeleo ya Awali ya Kazi na Ushauri",
    interest_both: "Maeneo yote mawili",

    // ── Mentor mentee count ──────────────────────────────────────────────────
    mentee_one: "Mmoja tu",
    mentee_2_5: "2 - 5",
    mentee_5_10: "5 - 10",
    mentee_10_20: "10 - 20",
    mentee_20_50: "20 - 50",
    mentee_50_plus: "50 na zaidi",

    // ── Expertise areas ──────────────────────────────────────────────────────
    expertise_entrepreneurship: "Maendeleo ya Ujasiriamali",
    expertise_finance: "Usimamizi wa Fedha na Elimu ya Fedha",
    expertise_investor: "Utayari wa Mwekezaji",
    expertise_biz_mgmt: "Mkakati wa Usimamizi wa Biashara na Utawala",
    expertise_biz_model: "Ubunifu wa Biashara na Fikra za Muundo",
    expertise_job_search: "Ujuzi wa Kutafuta Kazi",
    expertise_marketing: "Ujuzi wa Masoko na Mauzo",
    expertise_online_gigs: "Kazi za Mtandaoni na Kazi za Mbali",
    expertise_communication: "Mawasiliano na Kujenga Mahusiano",
    expertise_fundraising: "Uchangishaji na Uhamasishaji wa Rasilimali",
    expertise_digital: "Ujuzi wa Kidijitali",
    expertise_innovation: "Usimamizi wa Uvumbuzi",
    expertise_other: "Nyingine",

    // ── Entrepreneur Step 3 ──────────────────────────────────────────────────
    ent_step3_heading: "Tuambie kuhusu biashara yako.",
    ent_step3_subtitle:
      "Tusaidie kuelewa kazi yako ili tuweze kukuunganisha na msaada unaofaa.",
    ent_step3_biz_name_label: "Jina la biashara (kama inatumika)",
    ent_step3_biz_name_placeholder: "Mfano: Kilimo Fresh Ltd",
    ent_step3_sector_label: "Aina ya biashara / sekta",
    ent_step3_value_chain_question:
      "Unafanya kazi na mnyororo gani wa thamani wa kilimo?",
    ent_step3_activity_label:
      "Shughuli kuu / biashara kuu — eleza bidhaa au huduma yako kuu",
    ent_step3_activity_placeholder:
      "Mfano: Kuuza mboga mbichi moja kwa moja kwa kaya huko Dar es Salaam",
    ent_step3_formalization_label: "Je, biashara yako ina usajili rasmi?",
    ent_step3_years_label: "Miaka ya uendeshaji wa biashara",
    ent_step3_region_label: "Mkoa ambapo biashara yako inafanya kazi",
    ent_step3_region_placeholder: "Mfano: Arusha",
    ent_step3_district_label: "Wilaya ambapo biashara yako inafanya kazi",
    ent_step3_district_placeholder: "Mfano: Arumeru",
    ent_step3_error_sector: "Tafadhali chagua aina yako ya biashara.",
    ent_step3_error_activity:
      "Tafadhali eleza shughuli yako kuu ya biashara (angalau herufi 10).",
    ent_step3_error_formalization:
      "Tafadhali chagua hali ya usajili wa biashara yako.",
    ent_step3_error_region: "Tafadhali weka mkoa wa biashara yako.",
    ent_step3_error_district: "Tafadhali weka wilaya ya biashara yako.",
    ent_step3_error_generic: "Kuna hitilafu. Tafadhali jaribu tena.",

    // ── Entrepreneur sectors ─────────────────────────────────────────────────
    ent_sector_agriculture: "Kilimo",
    ent_sector_livestock: "Mifugo",
    ent_sector_fishing: "Uvuvi",
    ent_sector_processing: "Usindikaji",
    ent_sector_services: "Huduma",
    ent_sector_trade: "Biashara",
    ent_sector_other: "Nyingine",

    // ── Agricultural value chains ────────────────────────────────────────────
    vc_maize: "Mahindi",
    vc_rice: "Mchele",
    vc_sunflower: "Alizeti",
    vc_horticulture: "Bustani (mboga na matunda)",
    vc_poultry: "Kuku",
    vc_livestock: "Ufugaji (mifugo)",
    vc_cassava: "Muhogo",
    vc_beans: "Maharagwe",
    vc_other: "Nyingine",

    // ── Formalization options ────────────────────────────────────────────────
    form_not_registered: "Haijasajiliwa",
    form_brela: "Imesajiliwa kupitia BRELA",
    form_other: "Usajili mwingine (mfano: mamlaka ya mtaa, ushirika)",
    form_no_business: "Sina biashara",

    // ── Years of operation ───────────────────────────────────────────────────
    years_less_1: "Chini ya mwaka 1",
    years_1_3: "Miaka 1–3",
    years_4_5: "Miaka 4–5",
    years_more_5: "Zaidi ya miaka 5",

    // ── Entrepreneur Step 4 ──────────────────────────────────────────────────
    ent_step4_heading: "Maelezo ya Biashara Yako",
    ent_step4_subtitle:
      "Taarifa hizi zinasaidia kurekebisha msaada na rasilimali kulingana na mahitaji yako maalum. Taarifa zote zinabaki siri.",
    ent_step4_employees_label: "Idadi ya wafanyakazi (ukijumuisha wewe mwenyewe)",
    ent_step4_employees_placeholder: "Mfano: 3",
    ent_step4_revenue_label: "Mapato ya wastani ya kila mwezi (kwa TZS)",
    ent_step4_challenges_label:
      "Changamoto kuu zinazokabili biashara yako sasa hivi (chagua zote zinazofaa)",
    ent_step4_support_received_label:
      "Je, umewahi kupata mafunzo au msaada wa biashara kabla?",
    ent_step4_support_org_label: "Kutoka shirika au mradi gani?",
    ent_step4_support_org_placeholder: "Mfano: TangaYetu, AGRA",
    ent_step4_support_needed_label:
      "Unatafuta aina gani ya msaada kutoka IMED Connect? (chagua zote zinazofaa)",
    ent_step4_tin_label: "TIN / Nambari ya Usajili wa Biashara (si lazima)",
    ent_step4_tin_placeholder: "Mfano: 123-456-789",
    ent_step4_disability_label: "Je, una aina yoyote ya ulemavu?",
    ent_step4_disability_desc_label: "Tafadhali eleza ulemavu wako",
    ent_step4_disability_desc_placeholder: "Eleza",
    ent_step4_error_employees: "Tafadhali weka idadi ya wafanyakazi.",
    ent_step4_error_challenges:
      "Tafadhali chagua angalau changamoto moja kuu.",
    ent_step4_error_support:
      "Tafadhali onyesha kama umewahi kupata msaada wa biashara kabla.",
    ent_step4_error_support_org:
      "Tafadhali taja shirika au mradi uliotoa msaada.",
    ent_step4_error_support_needed:
      "Tafadhali chagua angalau aina moja ya msaada unayotafuta.",
    ent_step4_error_disability:
      "Tafadhali onyesha kama una aina yoyote ya ulemavu.",
    ent_step4_error_disability_desc: "Tafadhali eleza ulemavu wako.",
    ent_step4_error_generic: "Kuna hitilafu. Tafadhali jaribu tena.",

    // ── Revenue ranges ───────────────────────────────────────────────────────
    revenue_below_500k: "Chini ya TZS 500,000",
    revenue_500k_2m: "TZS 500,001 – 2,000,000",
    revenue_2m_5m: "TZS 2,000,001 – 5,000,000",
    revenue_above_5m: "Zaidi ya TZS 5,000,000",

    // ── Business challenges ──────────────────────────────────────────────────
    challenge_finance: "Upatikanaji wa fedha",
    challenge_markets: "Masoko",
    challenge_skills: "Ujuzi",
    challenge_technology: "Teknolojia",
    challenge_regulations: "Kanuni",
    challenge_climate: "Mabadiliko ya tabianchi",
    challenge_other: "Nyingine",

    // ── Support types ────────────────────────────────────────────────────────
    support_training: "Mafunzo ya biashara",
    support_mentorship: "Ushauri na uelekezaji",
    support_market: "Viungo vya masoko",
    support_finance: "Upatikanaji wa fedha",
    support_networking: "Kuunda mtandao",
    support_other: "Nyingine",
  },
};

export default translations;
```

- [ ] **Step 2: Commit**

```bash
git add lib/translations/index.js
git commit -m "feat: add English and Swahili translation strings"
```

---

### Task 3: Create `LanguageContext` and `useLanguage` hook

**Files:**
- Create: `lib/context/LanguageContext.js`

- [ ] **Step 1: Create the file**

```js
"use client";

import { useContext, createContext, useState, useEffect } from "react";
import translations from "@/lib/translations";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("imedconnect_lang");
    if (saved === "en" || saved === "sw") {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem("imedconnect_lang", newLang);
  };

  const t = (key) => {
    return (
      (translations[lang] && translations[lang][key]) ||
      (translations.en && translations.en[key]) ||
      key
    );
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
```

- [ ] **Step 2: Commit**

```bash
git add lib/context/LanguageContext.js
git commit -m "feat: add LanguageContext with localStorage persistence"
```

---

### Task 4: Create `LanguageToggle` component

**Files:**
- Create: `components/shared/LanguageToggle.jsx`

- [ ] **Step 1: Create the file**

```jsx
"use client";
import React from "react";
import { useLanguage } from "@/lib/context/LanguageContext";

const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex rounded-full bg-primary-light p-1 mt-4 self-start">
      <button
        onClick={() => setLang("en")}
        className={`rounded-full px-4 py-1.5 text-small-regular font-semibold transition-all duration-200 ${
          lang === "en" ? "bg-white text-primary-light" : "text-white"
        }`}
      >
        English
      </button>
      <button
        onClick={() => setLang("sw")}
        className={`rounded-full px-4 py-1.5 text-small-regular font-semibold transition-all duration-200 ${
          lang === "sw" ? "bg-white text-primary-light" : "text-white"
        }`}
      >
        Kiswahili
      </button>
    </div>
  );
};

export default LanguageToggle;
```

- [ ] **Step 2: Commit**

```bash
git add components/shared/LanguageToggle.jsx
git commit -m "feat: add LanguageToggle pill component"
```

---

### Task 5: Wire up layouts and update `FunderLogo`

**Files:**
- Modify: `app/(auth)/layout.jsx`
- Modify: `app/(root)/layout.js`
- Modify: `components/shared/FunderLogo.jsx`

- [ ] **Step 1: Update `app/(auth)/layout.jsx`**

```jsx
import { AuthContextProvider } from "@/lib/context/AuthContext";
import { LanguageProvider } from "@/lib/context/LanguageContext";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "IMED Connect",
  description: "Learn flawlessly.",
};

export default function RootLayout({ children }) {
  return (
    <AuthContextProvider>
      <LanguageProvider>
        <html lang="en" className={inter.className}>
          <body>
            <main className="h-screen">
              <div className="w-full h-full">{children}</div>
            </main>
          </body>
        </html>
      </LanguageProvider>
    </AuthContextProvider>
  );
}
```

- [ ] **Step 2: Update `app/(root)/layout.js`**

```js
import "../globals.css";
import { Roboto } from "next/font/google";
import Topbar from "@/components/shared/Topbar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import Bottombar from "@/components/shared/Bottombar";
import { AuthContextProvider } from "@/lib/context/AuthContext";
import { LanguageProvider } from "@/lib/context/LanguageContext";

const roboto = Roboto({ weight: "400", subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "IMED Connect",
  description: "Learn flawlessly",
};

export default function RootLayout({ children }) {
  return (
    <AuthContextProvider>
      <LanguageProvider>
        <html lang="en" className={roboto.className}>
          <body>
            <Topbar />
            <main className="flex flex-row">
              <LeftSidebar />
              <section className="main-container">
                <div className="w-full max-w-4xl h-full">{children}</div>
              </section>
            </main>
            {/* <Bottombar /> */}
          </body>
        </html>
      </LanguageProvider>
    </AuthContextProvider>
  );
}
```

- [ ] **Step 3: Update `components/shared/FunderLogo.jsx`**

```jsx
"use client";
import Image from "next/image";
import React from "react";
import LanguageToggle from "@/components/shared/LanguageToggle";
import { useLanguage } from "@/lib/context/LanguageContext";

const FunderLogo = () => {
  const { t } = useLanguage();

  return (
    <div className="mt-6">
      <div className="flex flex-row border border-slate-400 rounded-lg px-2 py-2 space-x-3">
        <Image
          src="/images/finnish.png"
          className="h-8 w-8 object-cover"
          height={512}
          width={512}
          alt="Finnish Embassy logo"
        />
        <p className="text-slate-300 text-subtle-regular tracking-wide">
          {t("funder_text")}
        </p>
      </div>
      <LanguageToggle />
    </div>
  );
};

export default FunderLogo;
```

- [ ] **Step 4: Verify in browser**

Run `npm run dev`. Open `/sign-in`. Confirm:
- FunderLogo shows the funding text
- Toggle appears below it with "English" and "Kiswahili" pills
- Clicking "Kiswahili" switches the active pill and updates the funding text to Swahili
- Clicking "English" switches back
- Refreshing the page preserves the selected language

- [ ] **Step 5: Commit**

```bash
git add app/\(auth\)/layout.jsx app/\(root\)/layout.js components/shared/FunderLogo.jsx
git commit -m "feat: wire LanguageProvider into layouts and add toggle to FunderLogo"
```

---

### Task 6: Translate `sign-in/page.jsx`

**Files:**
- Modify: `app/(auth)/sign-in/page.jsx`

- [ ] **Step 1: Add `useLanguage` and replace strings**

At the top of the component, add:
```js
import { useLanguage } from "@/lib/context/LanguageContext";
```

Inside the `page` component, add:
```js
const { t } = useLanguage();
```

Replace every hardcoded string in the JSX:

| Old | New |
|---|---|
| `<p className="text-slate-400">Sign In</p>` | `<p className="text-slate-400">{t("signin_subtitle")}</p>` |
| `Also available on android and ios.` | `{t("app_tagline")}` |
| `placeholder="Phone number"` | `placeholder={t("phone_number")}` |
| `placeholder="Password"` | `placeholder={t("password")}` |
| `Forgot password?` | `{t("forgot_password")}` |
| `<p>Sign In</p>` (button) | `<p>{t("sign_in")}</p>` |
| `Not a member?` | `{t("not_a_member")}` |
| `Register` (link text) | `{t("register")}` |

Replace error strings in `handleSignIn`:
```js
setError(t("signin_error_fill"));   // was: "Please fill everything!"
setError(t("signin_error_credentials")); // was: "Incorrect credentials!"
```

**Important:** `t` is called inside the component function body, so it is accessible in both the JSX and the event handler.

- [ ] **Step 2: Verify in browser**

Open `/sign-in`, switch to Kiswahili via the toggle. Confirm all labels, placeholders, button text, and the link text switch to Swahili. Switch back to English and confirm they revert.

- [ ] **Step 3: Commit**

```bash
git add "app/(auth)/sign-in/page.jsx"
git commit -m "feat: translate sign-in page to English/Swahili"
```

---

### Task 7: Translate `register/page.jsx`

**Files:**
- Modify: `app/(auth)/register/page.jsx`

- [ ] **Step 1: Add `useLanguage` and replace strings**

```js
import { useLanguage } from "@/lib/context/LanguageContext";
```

Inside the component:
```js
const { t } = useLanguage();
```

Replace in JSX:

| Old | New |
|---|---|
| `<p className="text-slate-400">Register</p>` | `<p className="text-slate-400">{t("register_subtitle")}</p>` |
| `Also available on android and ios.` | `{t("app_tagline")}` |
| `placeholder="Your name"` | `placeholder={t("your_name")}` |
| `placeholder="Phone number"` | `placeholder={t("phone_number")}` |
| `placeholder="Password"` | `placeholder={t("password")}` |
| `<p>Register Now</p>` | `<p>{t("register_btn")}</p>` |
| `Already a member?` | `{t("already_member")}` |
| `Sign In` (link text) | `{t("sign_in")}` |

Replace error strings in `handleRegister`:
```js
setError(t("register_error_name"));         // "Enter your full name!"
setError(t("register_error_phone"));        // "Enter a valid phone number!"
setError(t("register_error_phone_zero"));   // "Phone shouldn't start with 0!"
setError(t("register_error_password"));     // "Enter a strong password!"
setError(t("register_error_phone_in_use")); // "Phone number already in use."
setError(t("register_error_generic"));      // "Error! Check and try again."
```

- [ ] **Step 2: Verify in browser**

Open `/register`, switch to Kiswahili. Confirm all strings switch. Check error messages by submitting an empty form.

- [ ] **Step 3: Commit**

```bash
git add "app/(auth)/register/page.jsx"
git commit -m "feat: translate register page to English/Swahili"
```

---

### Task 8: Translate `reset/page.jsx`

**Files:**
- Modify: `app/(auth)/reset/page.jsx`

- [ ] **Step 1: Add `useLanguage` and replace strings**

```js
import { useLanguage } from "@/lib/context/LanguageContext";
```

Inside the component:
```js
const { t } = useLanguage();
```

Replace in JSX:

| Old | New |
|---|---|
| `<p className="text-slate-400">Reset password</p>` | `<p className="text-slate-400">{t("reset_subtitle")}</p>` |
| `Also available on android and ios.` | `{t("app_tagline")}` |
| `placeholder="Phone number"` | `placeholder={t("phone_number")}` |
| `placeholder="Six digits code"` | `placeholder={t("six_digits_code")}` |
| `<p>Send OTP</p>` | `<p>{t("send_otp")}</p>` |
| `Ready to continue?` | `{t("ready_to_continue")}` |
| `Sign In` (link text) | `{t("sign_in")}` |

Replace error strings:
```js
setError(t("reset_error_phone"));      // "Enter valid phone number!"
setError(t("reset_error_wrong_code")); // "Wrong code"
```

- [ ] **Step 2: Verify in browser**

Open `/reset`, switch to Kiswahili. Confirm all strings switch including the OTP step.

- [ ] **Step 3: Commit**

```bash
git add "app/(auth)/reset/page.jsx"
git commit -m "feat: translate reset page to English/Swahili"
```

---

### Task 9: Translate `StudentStepTwo` and `MentorStepTwo`

These two components are structurally identical — same strings, same fields. Apply identical changes to both.

**Files:**
- Modify: `components/student/StudentStepTwo.jsx`
- Modify: `components/mentor/MentorStepTwo.jsx`

- [ ] **Step 1: Apply changes to `StudentStepTwo.jsx`**

Add import:
```js
import { useLanguage } from "@/lib/context/LanguageContext";
```

Add inside component:
```js
const { t } = useLanguage();
```

Replace in JSX:

| Old | New |
|---|---|
| `Tell us about you!` | `{t("step2_heading")}` |
| `What is your date of birth?` | `{t("step2_dob_question")}` |
| `Please tell us your sex.` | `{t("step2_sex_question")}` |
| `<p ... >Male</p>` | `<p ...>{t("male")}</p>` |
| `<p ... >Female</p>` | `<p ...>{t("female")}</p>` |
| `Your alternative phone number` | `{t("step2_alt_phone_label")}` |
| `placeholder="Eg: 255** *** ***"` | `placeholder={t("step2_alt_phone_placeholder")}` |
| `Your email address` | `{t("step2_email_label")}` |
| `placeholder="Email address"` | `placeholder={t("step2_email_placeholder")}` |
| `<p>Back</p>` | `<p>{t("back")}</p>` |
| `<p>Next</p>` | `<p>{t("next")}</p>` |
| `text={"Log Out"}` | `text={t("log_out")}` |

Replace error strings in `saveData`:
```js
setError(t("step2_error_dob"));   // "Please enter a valid date of birth"
setError(t("step2_error_sex"));   // "Please select your sex"
setError(t("step2_error_phone")); // "Please enter a valid phone number."
setError(t("step2_error_email")); // "Please enter a valid email address."
```

- [ ] **Step 2: Apply identical changes to `MentorStepTwo.jsx`**

Make exactly the same changes as Step 1 in `MentorStepTwo.jsx`. The component structure is identical.

- [ ] **Step 3: Verify in browser**

Log in as a user at setup step 2. Switch to Kiswahili via the auth page first, then navigate to the setup step. Confirm all labels switch correctly.

- [ ] **Step 4: Commit**

```bash
git add components/student/StudentStepTwo.jsx components/mentor/MentorStepTwo.jsx
git commit -m "feat: translate StudentStepTwo and MentorStepTwo"
```

---

### Task 10: Translate `StudentStepThree`

**Files:**
- Modify: `components/student/StudentStepThree.jsx`

- [ ] **Step 1: Add import and hook**

```js
import { useLanguage } from "@/lib/context/LanguageContext";
```
```js
const { t } = useLanguage();
```

- [ ] **Step 2: Replace marital status choices array with translated objects**

Replace:
```js
<ChoiceChips
  choices={["Single", "Married", "Separated", "Widowed"]}
  selectedChoice={maritalStatus}
  onSelectChoice={setMaritalStatus}
/>
```
With:
```jsx
<ChoiceChips
  choices={[
    { label: t("marital_single"),    value: "Single" },
    { label: t("marital_married"),   value: "Married" },
    { label: t("marital_separated"), value: "Separated" },
    { label: t("marital_widowed"),   value: "Widowed" },
  ]}
  selectedChoice={maritalStatus}
  onSelectChoice={setMaritalStatus}
/>
```

- [ ] **Step 3: Replace remaining strings in JSX**

| Old | New |
|---|---|
| `Tell us more!` | `{t("student_step3_heading")}` |
| `What is your marital status?` | `{t("student_step3_marital_question")}` |
| `Please tell us your location.` | `{t("student_step3_location_question")}` |
| `placeholder="Eg: Dar Es Salaam, Kinondoni"` | `placeholder={t("student_step3_location_placeholder")}` |
| `<p>Back</p>` | `<p>{t("back")}</p>` |
| `<p>Next</p>` | `<p>{t("next")}</p>` |
| `text={"Log Out"}` | `text={t("log_out")}` |

Replace errors in `saveData`:
```js
setError(t("student_step3_error_marital"));  // "Please select your marital status"
setError(t("student_step3_error_location")); // "Please enter a valid location"
```

- [ ] **Step 4: Commit**

```bash
git add components/student/StudentStepThree.jsx
git commit -m "feat: translate StudentStepThree"
```

---

### Task 11: Translate `MentorStepThree`

**Files:**
- Modify: `components/mentor/MentorStepThree.jsx`

- [ ] **Step 1: Add import and hook**

```js
import { useLanguage } from "@/lib/context/LanguageContext";
```
```js
const { t } = useLanguage();
```

- [ ] **Step 2: Replace strings in JSX**

| Old | New |
|---|---|
| `Tell us more!` | `{t("mentor_step3_heading")}` |
| `What's your highest level of education?` | `{t("mentor_step3_level_question")}` |
| `label="Your highest level of education?"` | `label={t("mentor_step3_level_label")}` |
| `What is your highest field of study?` | `{t("mentor_step3_field_question")}` |
| `placeholder="Eg: Bachelor Degree in Linguistic"` | `placeholder={t("mentor_step3_field_placeholder")}` |
| `Please tell us your location.` | `{t("mentor_step3_location_question")}` |
| `placeholder="Eg: Dar Es Salaam, Kinondoni"` | `placeholder={t("mentor_step3_location_placeholder")}` |
| `<p>Back</p>` | `<p>{t("back")}</p>` |
| `<p>Next</p>` | `<p>{t("next")}</p>` |
| `text={"Log Out"}` | `text={t("log_out")}` |

Replace errors in `saveData`:
```js
setError(t("mentor_step3_error_field"));    // "Please enter field of study"
setError(t("mentor_step3_error_location")); // "Please enter a valid location"
```

- [ ] **Step 3: Commit**

```bash
git add components/mentor/MentorStepThree.jsx
git commit -m "feat: translate MentorStepThree"
```

---

### Task 12: Translate `StudentStepFour`

**Files:**
- Modify: `components/student/StudentStepFour.jsx`

- [ ] **Step 1: Add import and hook**

```js
import { useLanguage } from "@/lib/context/LanguageContext";
```
```js
const { t } = useLanguage();
```

- [ ] **Step 2: Replace strings in JSX**

| Old | New |
|---|---|
| `Tell us your education.` | `{t("student_step4_heading")}` |
| `What's your highest level of education?` | `{t("student_step4_level_question")}` |
| `label="Your highest level of education?"` | `label={t("student_step4_level_label")}` |
| `Course or program for your highest education level?` | `{t("student_step4_course_question")}` |
| `placeholder="Eg: Bachelor Degree in Linguistic"` | `placeholder={t("student_step4_course_placeholder")}` |
| `Name of the institution for your highest education level?` | `{t("student_step4_institution_question")}` |
| `placeholder="Eg: University Of Dar Es Salaam"` | `placeholder={t("student_step4_institution_placeholder")}` |
| `Which year did you graduate?` | `{t("student_step4_year_question")}` |
| `<p>Back</p>` | `<p>{t("back")}</p>` |
| `<p>Next</p>` | `<p>{t("next")}</p>` |
| `text={"Log Out"}` | `text={t("log_out")}` |

Replace errors in `saveData`:
```js
setError(t("student_step4_error_field"));       // "Please enter field of study"
setError(t("student_step4_error_institution")); // "Please enter a valid institution"
setError(t("student_step4_error_year"));        // "Please select graduation year"
```

- [ ] **Step 3: Commit**

```bash
git add components/student/StudentStepFour.jsx
git commit -m "feat: translate StudentStepFour"
```

---

### Task 13: Translate `MentorStepFour`

**Files:**
- Modify: `components/mentor/MentorStepFour.jsx`

- [ ] **Step 1: Add import and hook**

```js
import { useLanguage } from "@/lib/context/LanguageContext";
```
```js
const { t } = useLanguage();
```

- [ ] **Step 2: Replace Yes/No chips with translated objects**

Both `ChoiceChips` in this component use `["Yes", "No"]`. Replace both with:
```jsx
choices={[
  { label: t("yes"), value: "Yes" },
  { label: t("no"),  value: "No" },
]}
```

The comparisons `trainingChoice === "Yes"` and `experienceChoice === "Yes"` remain unchanged — the stored values are still English.

- [ ] **Step 3: Replace remaining strings in JSX**

| Old | New |
|---|---|
| `Tell us about your skills.` | `{t("mentor_step4_heading")}` |
| `Have you attended any professional training...` | `{t("mentor_step4_training_question")}` |
| `Provide details of the training ( course, award, year)` | `{t("mentor_step4_training_detail_label")}` |
| `placeholder="Description"` (training) | `placeholder={t("description_placeholder")}` |
| `Do you have any experience in business or career coaching?...` | `{t("mentor_step4_experience_question")}` |
| `Please describe your experience and the area of experience.` | `{t("mentor_step4_experience_detail_label")}` |
| `placeholder="Description"` (experience) | `placeholder={t("description_placeholder")}` |
| `<p>Back</p>` | `<p>{t("back")}</p>` |
| `<p>Next</p>` | `<p>{t("next")}</p>` |
| `text={"Log Out"}` | `text={t("log_out")}` |

Replace errors in `saveData`:
```js
setError(t("mentor_step4_error_training"));        // "Please select training status"
setError(t("mentor_step4_error_training_detail")); // "Please detail the training"
setError(t("mentor_step4_error_experience"));      // "Please select experience status"
setError(t("mentor_step4_error_experience_detail")); // "Please detail your experience"
```

- [ ] **Step 4: Commit**

```bash
git add components/mentor/MentorStepFour.jsx
git commit -m "feat: translate MentorStepFour"
```

---

### Task 14: Translate `StudentStepFive`

**Files:**
- Modify: `components/student/StudentStepFive.jsx`

- [ ] **Step 1: Add import and hook**

```js
import { useLanguage } from "@/lib/context/LanguageContext";
```
```js
const { t } = useLanguage();
```

- [ ] **Step 2: Replace sectors array with translated objects**

Replace the `sectors` constant and pass it to `Interests`:
```js
// Remove the top-level const sectors = [...] definition and compute inline:
const sectors = [
  { label: t("sector_agriculture"), value: "Agriculture, Agribusiness or Agro-processing" },
  { label: t("sector_transport"),   value: "Transport and Logistics" },
  { label: t("sector_tourism"),     value: "Tourism and Hospitality" },
  { label: t("sector_construction"),value: "Construction" },
  { label: t("sector_ict"),         value: "Information and Communication Technology" },
  { label: t("sector_agroforestry"),value: "Agroforestry" },
  { label: t("sector_energy"),      value: "Energy" },
  { label: t("sector_other"),       value: "Other" },
];
```

Move this inside the component function body (after `const { t } = useLanguage()`), replacing the module-level constant.

- [ ] **Step 3: Replace timings array**

Move inside the component function body:
```js
const timings = [
  { label: t("timing_anytime"),           value: "Anytime during working hours" },
  { label: t("timing_morning_weekday"),   value: "Morning on weekdays" },
  { label: t("timing_afternoon_weekday"), value: "Afternoon on weekdays" },
  { label: t("timing_evening_weekday"),   value: "Evening on weekdays" },
  { label: t("timing_morning_weekend"),   value: "Morning on weekends" },
  { label: t("timing_afternoon_weekend"), value: "Afternoon on weekends" },
  { label: t("timing_evening_weekend"),   value: "Evening on weekends" },
];
```

- [ ] **Step 4: Replace devices chips**

```jsx
<MultipleChoiceChips
  choices={[
    { label: t("device_smartphone"), value: "Smartphone" },
    { label: t("device_computer"),   value: "Computer" },
    { label: t("device_tablet"),     value: "Tablet" },
    { label: t("device_none"),       value: "None" },
  ]}
  selectedChoices={device}
  onSelectChoice={handleSelectChoice}
/>
```

- [ ] **Step 5: Replace remaining strings in JSX**

| Old | New |
|---|---|
| `Tell us your preference.` | `{t("student_step5_heading")}` |
| `Which sector do you prefer...` | `{t("student_step5_sector_question")}` |
| `What is your most preferred timing...` | `{t("student_step5_timing_question")}` |
| `Which devices do you use...` | `{t("student_step5_device_question")}` |
| `<p>Back</p>` | `<p>{t("back")}</p>` |
| `<p>Next</p>` | `<p>{t("next")}</p>` |
| `text={"Log Out"}` | `text={t("log_out")}` |

Replace error in `saveData`:
```js
setError(t("student_step5_error_device")); // "Please select device."
```

**Note:** `StudentStepFive` imports `MultipleChoiceChips` (not `MultipleCheckbox`). Check if `MultipleChoiceChips` also needs `{ label, value }` support before this step. If it is a separate component file, open it and apply the same `getLabel`/`getValue` pattern from Task 1.

- [ ] **Step 6: Check `MultipleChoiceChips`**

Open `components/shared/MultipleChoiceChips.jsx`. If it uses `choice` directly as both display and stored value, apply the same backward-compatible `getLabel`/`getValue` pattern from Task 1. If it already delegates correctly, skip.

- [ ] **Step 7: Commit**

```bash
git add components/student/StudentStepFive.jsx components/shared/MultipleChoiceChips.jsx
git commit -m "feat: translate StudentStepFive"
```

---

### Task 15: Translate `MentorStepFive`

**Files:**
- Modify: `components/mentor/MentorStepFive.jsx`

- [ ] **Step 1: Add import and hook**

```js
import { useLanguage } from "@/lib/context/LanguageContext";
```
```js
const { t } = useLanguage();
```

- [ ] **Step 2: Replace module-level constants with in-component translated arrays**

Move all arrays inside the component function body after `const { t } = useLanguage()`:

```js
const interests = [
  { label: t("interest_business"), value: "Business Development and Entrepreneurship" },
  { label: t("interest_career"),   value: "Early Career Development and Counselling" },
  { label: t("interest_both"),     value: "Both areas" },
];

const numbers = [
  { label: t("mentee_one"),    value: "Just one" },
  { label: t("mentee_2_5"),    value: "2 - 5" },
  { label: t("mentee_5_10"),   value: "5 - 10" },
  { label: t("mentee_10_20"),  value: "10 - 20" },
  { label: t("mentee_20_50"),  value: "20 - 50" },
  { label: t("mentee_50_plus"),value: "50 and above" },
];

const timings = [
  { label: t("timing_anytime"),           value: "Anytime during working hours" },
  { label: t("timing_morning_weekday"),   value: "Morning on weekdays" },
  { label: t("timing_afternoon_weekday"), value: "Afternoon on weekdays" },
  { label: t("timing_evening_weekday"),   value: "Evening on weekdays" },
  { label: t("timing_morning_weekend"),   value: "Morning on weekends" },
  { label: t("timing_afternoon_weekend"), value: "Afternoon on weekends" },
  { label: t("timing_evening_weekend"),   value: "Evening on weekends" },
];

const options = [
  { label: t("expertise_entrepreneurship"), value: "Entrepreneurship development" },
  { label: t("expertise_finance"),          value: "Financial management and literacy" },
  { label: t("expertise_investor"),         value: "Investor readiness" },
  { label: t("expertise_biz_mgmt"),         value: "Business Management Strategy and Governance" },
  { label: t("expertise_biz_model"),        value: "Business Modelling and Design thinking" },
  { label: t("expertise_job_search"),       value: "Job searching skills" },
  { label: t("expertise_marketing"),        value: "Marketing and selling skills" },
  { label: t("expertise_online_gigs"),      value: "Online Gigs and Remote jobs" },
  { label: t("expertise_communication"),    value: "Communication and Relationship building" },
  { label: t("expertise_fundraising"),      value: "Fundraising and resource mobilization" },
  { label: t("expertise_digital"),          value: "Digital Skills" },
  { label: t("expertise_innovation"),       value: "Innovation Management" },
  { label: t("expertise_other"),            value: "Other" },
];
```

Delete the four module-level `const` declarations above the component function.

- [ ] **Step 3: Replace remaining strings in JSX**

| Old | New |
|---|---|
| `Tell us your preferences.` | `{t("mentor_step5_heading")}` |
| `Select major  areas of interest...` | `{t("mentor_step5_interest_question")}` |
| `Select specific areas  of expertise...` | `{t("mentor_step5_expertise_question")}` |
| `How many mentees can you handle...` | `{t("mentor_step5_number_question")}` |
| `What is your most preferred timing...` | `{t("mentor_step5_timing_question")}` |
| `<p>Back</p>` | `<p>{t("back")}</p>` |
| `<p>Next</p>` | `<p>{t("next")}</p>` |
| `text={"Log Out"}` | `text={t("log_out")}` |

Replace error in `saveData`:
```js
setError(t("mentor_step5_error_expertise")); // "Please select atleast one area of expertise."
```

- [ ] **Step 4: Commit**

```bash
git add components/mentor/MentorStepFive.jsx
git commit -m "feat: translate MentorStepFive"
```

---

### Task 16: Translate `EntrepreneurStepThree`

**Files:**
- Modify: `components/entrepreneur/EntrepreneurStepThree.jsx`

- [ ] **Step 1: Add import and hook**

```js
import { useLanguage } from "@/lib/context/LanguageContext";
```
```js
const { t } = useLanguage();
```

- [ ] **Step 2: Move translated arrays inside component**

Delete the module-level constants and add inside the component:

```js
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
  { label: t("vc_maize"),       value: "Maize" },
  { label: t("vc_rice"),        value: "Rice" },
  { label: t("vc_sunflower"),   value: "Sunflower" },
  { label: t("vc_horticulture"),value: "Horticulture (vegetables & fruits)" },
  { label: t("vc_poultry"),     value: "Poultry" },
  { label: t("vc_livestock"),   value: "Animal Keeping (livestock)" },
  { label: t("vc_cassava"),     value: "Cassava" },
  { label: t("vc_beans"),       value: "Beans" },
  { label: t("vc_other"),       value: "Other" },
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
```

Note: `yearsOptions` is kept in English (passed to `SingleOptionDropdown` which stores the value; years are displayed in the profile view not yet translated).

Also update the sector onChange to still compare to the English value:
```jsx
onSelectChoice={(val) => {
  setSector(val);
  if (val !== "Agriculture") setValueChains([]);
}}
```
This still works because `getValue` returns the English `value` field.

- [ ] **Step 3: Replace remaining strings in JSX**

| Old | New |
|---|---|
| `Tell us about your business.` | `{t("ent_step3_heading")}` |
| `Help us understand your work...` | `{t("ent_step3_subtitle")}` |
| `Business name (if applicable)` | `{t("ent_step3_biz_name_label")}` |
| `placeholder="Eg: Kilimo Fresh Ltd"` | `placeholder={t("ent_step3_biz_name_placeholder")}` |
| `Type of business / sector` | `{t("ent_step3_sector_label")}` |
| `Which agricultural value chain...` | `{t("ent_step3_value_chain_question")}` |
| `Main activity / core business —...` | `{t("ent_step3_activity_label")}` |
| `placeholder="Eg: Selling fresh vegetables..."` | `placeholder={t("ent_step3_activity_placeholder")}` |
| `Is your business formalized / registered?` | `{t("ent_step3_formalization_label")}` |
| `Years of business operation` | `{t("ent_step3_years_label")}` |
| `Region where your business operates` | `{t("ent_step3_region_label")}` |
| `placeholder="Eg: Arusha"` | `placeholder={t("ent_step3_region_placeholder")}` |
| `District where your business operates` | `{t("ent_step3_district_label")}` |
| `placeholder="Eg: Arumeru"` | `placeholder={t("ent_step3_district_placeholder")}` |
| `<p>Back</p>` | `<p>{t("back")}</p>` |
| `<p>Next</p>` | `<p>{t("next")}</p>` |
| `text={"Log Out"}` | `text={t("log_out")}` |

Replace errors in `saveData`:
```js
setError(t("ent_step3_error_sector"));
setError(t("ent_step3_error_activity"));
setError(t("ent_step3_error_formalization"));
setError(t("ent_step3_error_region"));
setError(t("ent_step3_error_district"));
setError(t("ent_step3_error_generic")); // in catch block
```

- [ ] **Step 4: Commit**

```bash
git add components/entrepreneur/EntrepreneurStepThree.jsx
git commit -m "feat: translate EntrepreneurStepThree"
```

---

### Task 17: Translate `EntrepreneurStepFour`

**Files:**
- Modify: `components/entrepreneur/EntrepreneurStepFour.jsx`

- [ ] **Step 1: Add import and hook**

```js
import { useLanguage } from "@/lib/context/LanguageContext";
```
```js
const { t } = useLanguage();
```

- [ ] **Step 2: Move translated arrays inside component**

Delete module-level constants and add inside component:

```js
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
  { label: t("support_training"),    value: "Business training" },
  { label: t("support_mentorship"),  value: "Mentorship" },
  { label: t("support_market"),      value: "Market linkages" },
  { label: t("support_finance"),     value: "Access to finance" },
  { label: t("support_networking"),  value: "Networking" },
  { label: t("support_other"),       value: "Other" },
];
```

Note: `revenueRanges` kept in English (stored in Firestore, displayed in profile).

Replace Yes/No chips for `receivedSupport` and `disability`:
```jsx
choices={[
  { label: t("yes"), value: "Yes" },
  { label: t("no"),  value: "No" },
]}
```

The comparisons `receivedSupport === "Yes"` and `disability === "Yes"` remain unchanged.

- [ ] **Step 3: Replace remaining strings in JSX**

| Old | New |
|---|---|
| `Your Business Details` | `{t("ent_step4_heading")}` |
| `This information helps us tailor support...` | `{t("ent_step4_subtitle")}` |
| `Number of employees (including yourself)` | `{t("ent_step4_employees_label")}` |
| `placeholder="Eg: 3"` | `placeholder={t("ent_step4_employees_placeholder")}` |
| `Average monthly revenue (in TZS)` | `{t("ent_step4_revenue_label")}` |
| `Main challenges currently facing...` | `{t("ent_step4_challenges_label")}` |
| `Have you received any business training...` | `{t("ent_step4_support_received_label")}` |
| `From which organisation or project?` | `{t("ent_step4_support_org_label")}` |
| `placeholder="Eg: TangaYetu, AGRA"` | `placeholder={t("ent_step4_support_org_placeholder")}` |
| `What kind of support are you looking for...` | `{t("ent_step4_support_needed_label")}` |
| `TIN / Business Registration Number (optional)` | `{t("ent_step4_tin_label")}` |
| `placeholder="Eg: 123-456-789"` | `placeholder={t("ent_step4_tin_placeholder")}` |
| `Do you have any form of disability?` | `{t("ent_step4_disability_label")}` |
| `Please describe your disability` | `{t("ent_step4_disability_desc_label")}` |
| `placeholder="Describe"` | `placeholder={t("ent_step4_disability_desc_placeholder")}` |
| `<p>Back</p>` | `<p>{t("back")}</p>` |
| `<p>Submit</p>` | `<p>{t("submit")}</p>` |
| `text={"Log Out"}` | `text={t("log_out")}` |

Replace errors in `saveData`:
```js
setError(t("ent_step4_error_employees"));
setError(t("ent_step4_error_challenges"));
setError(t("ent_step4_error_support"));
setError(t("ent_step4_error_support_org"));
setError(t("ent_step4_error_support_needed"));
setError(t("ent_step4_error_disability"));
setError(t("ent_step4_error_disability_desc"));
setError(t("ent_step4_error_generic")); // in catch block
```

- [ ] **Step 4: Final end-to-end verification**

Run `npm run dev`. Test the full flow:
1. Open `/sign-in` — toggle to Kiswahili — confirm all text switches
2. Open `/register` — confirm Swahili
3. Open `/reset` — confirm Swahili
4. Refresh `/sign-in` — confirm Kiswahili is remembered from localStorage
5. Toggle back to English — confirm English restored
6. Log in with a test account at setup step 2 — confirm Swahili carries over to setup pages
7. Advance through steps 3, 4, 5 — confirm each step shows Swahili
8. Switch a Mentor account through steps 2–5 — confirm Swahili
9. Switch an Entrepreneur account through steps 3–4 — confirm Swahili
10. Fill out a form in Swahili and submit — open Firestore and confirm stored values are English (e.g. `user_sex: "Male"`, not `"Mme"`)

- [ ] **Step 5: Commit**

```bash
git add components/entrepreneur/EntrepreneurStepFour.jsx
git commit -m "feat: translate EntrepreneurStepFour — dual language support complete"
```
