# Entrepreneur / MSME Onboarding — Design Spec

**Date:** 2026-03-29
**Status:** Approved
**Scope:** Registration + onboarding only. OTP fixes and bilingual support are deferred to separate sessions.

---

## 1. Overview

Add a third account type — **Entrepreneur / MSME** — to the IMED Connect registration flow. This serves additional beneficiary groups (AGRA Agri-MSMEs, TangaYetu, DREEM 3.0, general public) who are not Youth Graduates or Mentors.

The change touches three areas:
1. `AccountDecider.jsx` — add the third option card
2. `Guardian.jsx` — add routing for Entrepreneur steps 2, 3, 4
3. New components — `EntrepreneurStepThree.jsx` and `EntrepreneurStepFour.jsx`

Existing Student and Mentor flows are **unchanged**.

---

## 2. Account Type

| Attribute | Value |
|---|---|
| Display label | Entrepreneur / MSME |
| Description shown to user | Access resources and connect with support networks to grow your business. |
| Firestore `user_type` value | `"Entrepreneur"` |

Rationale: mirrors the existing pattern ("Student", "Mentor") — short, unambiguous.

---

## 3. Onboarding Step Sequence

```
Step 1  → AccountDecider      (choose Student / Mentor / Entrepreneur)
Step 2  → StudentStepTwo      (reused: DOB, sex, alt phone, email)
Step 3  → EntrepreneurStepThree  (business profile: Q1–Q7 + Q12)
Step 4  → EntrepreneurStepFour   (financial + challenges: Q8–Q13 + disability)
Step 6  → PendingAccount      (awaiting admin approval)
```

Steps 3 and 4 are Entrepreneur-only. Step 2 is shared with the Student flow by routing in the Guardian — no changes are needed inside `StudentStepTwo`.

---

## 4. Firestore Field Mapping

No new fields are introduced. All 13 questionnaire questions map to existing fields on the user document.

| # | Question | Firestore Field | Notes |
|---|---|---|---|
| Q1 | Business Name (optional) | `user_highest_institution_name` | Unused for Entrepreneurs (education field) |
| Q2 | Type of Business / Sector | `user_preferred_sector_to_specialize` | Single select |
| Q3 | Agricultural value chain (conditional) | `user_areas_of_expertise` | Array; shown only when Q2 = Agriculture |
| Q4 | Main Activity / Core Business description | `user_business_ownership_details` | Free text |
| Q5 | Formalization status | `user_business_is_formalized` | Stores option string; options: "Not registered", "Registered through BRELA", "Other Registrations", "I have no business" |
| Q6 | Years of operation | `user_business_started` | Stores range string: "Less than 1 year", "1–3 years", etc. |
| Q7 | Number of employees (incl. self) | `user_business_plan` | Text input, repurposed |
| Q8 | Average Monthly Revenue (TZS range) | `user_monthly_income` | Single select |
| Q9 | Main challenges (multi-select) | `user_areas_of_interest` | Array |
| Q10 | Received business training/support | `user_has_received_support` | Yes/No |
| Q10b | If Yes: from which organisation/project | `user_mentorship_training_detail` | Conditional text input |
| Q11 | Support needed from IMED Connect (multi) | `user_available_times` | Array, repurposed |
| Q12 | Location (Region + District) | `user_region` + `user_district` | Two text fields |
| Q13 | TIN / Business Registration No. (optional) | `user_current_mo` | Optional text input |
| — | Disability | `user_has_disability` + `user_disability_description` | Yes/No + conditional text |

---

## 5. Component Changes

### 5.1 AccountDecider.jsx

Add a third selectable card below the Mentor card:

```
Entrepreneur / MSME
Access resources and connect with support networks to grow your business.
[selected/unselected icon]
```

Value saved to Firestore: `user_type: "Entrepreneur"`.

### 5.2 Guardian.jsx

Add three new conditions (after the existing Mentor step 2–5 blocks):

```js
// Step 2 — reuse StudentStepTwo
if (userData.user_type == "Entrepreneur" && userData.user_profile_setup_step == "2")
  return <StudentStepTwo userData={userData} />;

// Step 3
if (userData.user_type == "Entrepreneur" && userData.user_profile_setup_step == "3")
  return <EntrepreneurStepThree userData={userData} />;

// Step 4
if (userData.user_type == "Entrepreneur" && userData.user_profile_setup_step == "4")
  return <EntrepreneurStepFour userData={userData} />;
```

### 5.3 EntrepreneurStepThree.jsx

**Location:** `components/entrepreneur/EntrepreneurStepThree.jsx`

Questions covered: Q1, Q2, Q3 (conditional), Q4, Q5, Q6, Q12.

- Q1: Text input — Business Name (optional)
- Q2: Dropdown/chips — Sector (Agriculture, Livestock, Fishing, Processing, Services, Trade, Other)
- Q3: Multi-checkbox — shown only when Q2 = "Agriculture"; value chain options: Maize, Rice, Sunflower, Horticulture, Poultry, Animal Keeping, Cassava, Beans, Other
- Q4: Textarea — Main Activity / Core Business
- Q5: Single select chips — Formalization (4 options)
- Q6: Single select dropdown — Years of operation (4 ranges)
- Q12: Two text inputs — Region, District

On submit: saves all fields + `user_profile_setup_step: "4"`.
Back button: returns to `user_profile_setup_step: "2"`.

### 5.4 EntrepreneurStepFour.jsx

**Location:** `components/entrepreneur/EntrepreneurStepFour.jsx`

Questions covered: Q7, Q8, Q9, Q10, Q11, Q13, disability.

- Q7: Text input — Number of employees
- Q8: Single select dropdown — Monthly revenue range (4 bands in TZS)
- Q9: Multi-checkbox — Main challenges (Access to finance, Markets, Skills, Technology, Regulations, Climate change, Other)
- Q10: Yes/No chips — Received training before; conditional text input for org/project name
- Q11: Multi-checkbox — Support needed (Business training, Mentorship, Market linkages, Access to finance, Networking, Other)
- Q13: Text input (optional) — TIN / Business Registration Number
- Disability: Yes/No chips; conditional text input for description

On submit: saves all fields + `user_profile_setup_step: "6"` → routes to PendingAccount.
Back button: returns to `user_profile_setup_step: "3"`.

---

## 6. Validation Rules

- Q4 (Main Activity): minimum 10 characters
- Q12 Region + District: both required, minimum 3 characters each
- Q7 (Employees): required, non-empty
- Q8 (Revenue): required selection
- Q9 (Challenges): at least one selection
- Q10b (org name): required only when Q10 = "Yes"
- Q11 (Support needed): at least one selection
- Disability description: required only when disability = "Yes"
- All other fields: optional or have reasonable defaults

---

## 7. Out of Scope (Deferred)

- OTP delivery fixes (separate session)
- Bilingual English / Kiswahili support (separate session)
- Admin dashboard changes for Entrepreneur user type
- Entrepreneur-specific profile view or dashboard
