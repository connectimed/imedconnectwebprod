# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

**IMEDConnect** is an educational platform built with Next.js 14 (App Router), Firebase, and Tailwind CSS + DaisyUI. It targets medical students and mentors in Tanzania.

### Route Groups

- `app/(auth)/` — Public routes: sign-in, register, reset, contact
- `app/(root)/` — Protected dashboard routes, wrapped by an auth Guardian; role-based UI for Student / Mentor / Admin
- `app/(livepdfchat)/` — Fullscreen experiences: PDF viewer, livestream room, messaging
- `app/(policies)/` — Static terms/privacy pages
- `app/api/` — Two API routes: `POST /api/verify` (SMS OTP) and `POST /api/change-password`

### Auth & User Roles

Auth state lives in `lib/context/AuthContext.js` and is consumed throughout via `useContext(AuthContext)`. The context exposes `user` (Firebase Auth), `userData` (Firestore doc), and `loading`.

Phone-based login maps phone numbers to synthetic emails: `255${phone}@gmail.com`. OTP is sent via an external SMS service (messaging-service.co.tz).

User roles (`userData.user_type`): `Student`, `Mentor`, `Admin`. The `(root)` layout checks this to render role-appropriate dashboards and guard admin-only features.

### Firebase

- `lib/firebase/firebase.js` — Initializes and exports `auth`, `db` (Firestore), `storage`
- `lib/firebase/` — Also contains the auth guard component
- All Firestore reads use client-side `getDocs`/`getDoc`/`onSnapshot` — there are no Next.js Server Components doing data fetching; everything is client-fetched in `useEffect` hooks

### Component Organization

```
components/
  admin/     # CRUD UIs for modules, topics, exams, users, notices
  mentor/    # Mentor booking, student management, badge display
  student/   # Module progress, exam taking, mentor discovery
  shared/    # 80+ reusable UI components (modals, cards, loaders, etc.)
```

### Key External Integrations

| Service                                          | Purpose                                |
| ------------------------------------------------ | -------------------------------------- |
| Firebase Auth/Firestore/Storage                  | Auth, database, file storage           |
| ZegoCloud (`@zegocloud/zego-uikit-prebuilt`)     | Video calls and livestreaming          |
| Algolia (`algoliasearch`, `react-instantsearch`) | Full-text search                       |
| Tiptap                                           | Rich text editing for content creation |
| Vimeo                                            | Embedded video in modules              |
| XLSX                                             | Spreadsheet export for admin           |

### Styling Conventions

- Tailwind CSS with custom utility classes defined in `tailwind.config.js`: `heading1-bold`, `heading2-bold`, `body-regular`, `subtle-medium`, etc.
- DaisyUI for component primitives (buttons, modals, badges)
- Dark mode via class strategy (`dark:` prefix)
- Path alias `@/` maps to the project root

### Import Alias

Use `@/` for all internal imports (configured in `jsconfig.json`).

<!-- docs/superpowers/specs/2026-03-29-entrepreneur-onboarding-design.md -->
