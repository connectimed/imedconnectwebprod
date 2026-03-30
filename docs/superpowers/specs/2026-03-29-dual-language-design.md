# Dual Language Support (English / Swahili) — Design Spec

**Date:** 2026-03-29
**Status:** Approved

---

## Overview

Add English / Swahili language switching to the auth pages and account setup step pages of IMEDConnect. The language toggle lives only in the `FunderLogo` component (which appears on all 3 auth pages). Language is persisted in `localStorage` and propagates instantly to all targeted components via React Context.

---

## Scope

**Toggle placement:** `FunderLogo` component only (auth pages: sign-in, register, reset).

**Translated pages/components:**
- Auth pages: `sign-in/page.jsx`, `register/page.jsx`, `reset/page.jsx`
- Student setup steps: `StudentStepTwo`, `StudentStepThree`, `StudentStepFour`, `StudentStepFive`
- Mentor setup steps: `MentorStepTwo`, `MentorStepThree`, `MentorStepFour`, `MentorStepFive`
- Entrepreneur setup steps: `EntrepreneurStepThree`, `EntrepreneurStepFour`

**Not in scope:** Dashboard, admin, mentor/student profile views, forums, modules, or any other pages beyond the above.

---

## Architecture

### New Files

#### `lib/context/LanguageContext.js`
- `"use client"` React context
- Reads initial language from `localStorage` key `imedconnect_lang` (defaults to `"en"`)
- Exposes `{ lang, setLang, t }` via `useLanguage()` hook
- `t(key)` looks up `translations[lang][key]`, falls back to `translations.en[key]` if key missing in active lang
- `setLang(newLang)` updates React state (instant re-render) AND writes to `localStorage`

#### `lib/translations/index.js`
- Single flat object: `const translations = { en: { ... }, sw: { ... } }`
- All string keys used across the 13 targeted components
- Covers: page labels, form placeholders, button text, navigation links, inline validation errors, choice option labels, the FunderLogo funding text
- Placeholder examples (e.g. `"Eg: Dar Es Salaam"`) are translated into Swahili equivalents

#### `components/shared/LanguageToggle.jsx`
- Pill-shaped toggle matching the reference design
- Purple/primary-color container background
- Active option: white rounded pill with purple text
- Inactive option: transparent background with white text
- Labels: `"English"` and `"Kiswahili"`
- Calls `setLang("en")` or `setLang("sw")` from `useLanguage()`

---

### Modified Files

| File | Change |
|---|---|
| `app/(auth)/layout.jsx` | Wrap children with `<LanguageProvider>` |
| `app/(root)/layout.js` | Wrap children with `<LanguageProvider>` |
| `components/shared/FunderLogo.jsx` | Render `<LanguageToggle />` below funding text; translate funding text via `t()` |
| `app/(auth)/sign-in/page.jsx` | Replace hardcoded strings with `t("key")` |
| `app/(auth)/register/page.jsx` | Replace hardcoded strings with `t("key")` |
| `app/(auth)/reset/page.jsx` | Replace hardcoded strings with `t("key")` |
| `components/student/StudentStepTwo.jsx` | Replace hardcoded strings with `t("key")` |
| `components/student/StudentStepThree.jsx` | Replace hardcoded strings with `t("key")` |
| `components/student/StudentStepFour.jsx` | Replace hardcoded strings with `t("key")` |
| `components/student/StudentStepFive.jsx` | Replace hardcoded strings with `t("key")` |
| `components/mentor/MentorStepTwo.jsx` | Replace hardcoded strings with `t("key")` |
| `components/mentor/MentorStepThree.jsx` | Replace hardcoded strings with `t("key")` |
| `components/mentor/MentorStepFour.jsx` | Replace hardcoded strings with `t("key")` |
| `components/mentor/MentorStepFive.jsx` | Replace hardcoded strings with `t("key")` |
| `components/entrepreneur/EntrepreneurStepThree.jsx` | Replace hardcoded strings with `t("key")` |
| `components/entrepreneur/EntrepreneurStepFour.jsx` | Replace hardcoded strings with `t("key")` |

---

## Data Flow

```
User clicks toggle in FunderLogo
  → LanguageToggle calls setLang("sw")
    → LanguageContext updates lang state
      → All components using useLanguage() re-render
        → t("key") returns Swahili strings
    → localStorage.setItem("imedconnect_lang", "sw")

User navigates to setup step page
  → LanguageProvider initialises lang from localStorage ("sw")
    → Setup step renders in Swahili immediately
```

---

## Translation String Categories

### Auth Pages
- Page subtitle labels: "Sign In", "Register", "Reset password"
- App tagline: "Also available on android and ios."
- Form input placeholders: "Phone number", "Password", "Your name", "Six digits code"
- Button text: "Sign In", "Register Now", "Send OTP"
- Links: "Forgot password?", "Not a member? Register", "Already a member? Sign In", "Ready to continue? Sign In"
- Validation errors: "Please fill everything!", "Incorrect credentials!", "Enter your full name!", "Enter a valid phone number!", "Phone shouldn't start with 0!", "Enter a strong password!", "Phone number already in use.", "Error! Check and try again.", "Enter valid phone number!", "Wrong code"
- FunderLogo text: "The IMED Connect project is funded by the Finnish Embassy."

### Setup Steps (shared across student/mentor/entrepreneur)
- Navigation buttons: "Back", "Next", "Submit"
- Log out link: "Log Out"
- Common binary choices: "Yes", "No", "Male", "Female"
- Marital status choices: "Single", "Married", "Separated", "Widowed"

### Student Step 2
- Heading: "Tell us about you!", question labels for date of birth, sex, alternative phone, email address

### Student Step 3
- Heading: "Tell us more!", question labels for marital status, location

### Student Step 4
- Heading: "Tell us your education.", question labels for education level, course/program, institution name, graduation year

### Student Step 5
- Heading: "Tell us your preference.", question labels for sector, timing, devices

### Mentor Steps 2–5
- Same patterns as student but with mentor-specific questions about mentorship training, experience, coaching expertise, number of mentees, areas of interest/expertise

### Entrepreneur Steps 3–4
- Business profile questions: sector, value chains, main activity, formalization status, years of operation, region/district
- Financial questions: employees, revenue, challenges, received support, support needed, TIN, disability

---

## localStorage Key

`imedconnect_lang` — stores `"en"` or `"sw"`. Survives page reloads and navigation between auth and setup pages.

---

## Swahili Translations

Translations are written by Claude and should be reviewed by a native Swahili speaker for accuracy. The translations aim for natural, everyday Tanzanian Swahili rather than formal or academic language.
