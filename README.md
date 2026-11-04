# MediFlow Patient

Patient mobile app for the MediFlow clinic: appointments, medical record (consultations, reports, X-rays, lab results) and profile. Built with Expo (React Native), Expo Router, Uniwind (Tailwind) and React Native Reusables. Runs on iOS, Android and web.

## Getting started

Requirements: Node 22 or later, and the Expo Go app on your phone (or an Android emulator / iOS simulator).

```bash
git clone <repo-url>
cd cabinet-app
npm install
npm run dev
```

Scan the QR code with Expo Go, or press `a` (Android), `i` (iOS, Mac only) or `w` (web).

The app runs on mock data by default. Sign in with `sara.benali@example.com` / `Patient@123`.

## Scripts

| Script                 | What it does                                          |
| ---------------------- | ----------------------------------------------------- |
| `npm run dev`          | Starts the Expo dev server (cache cleared)            |
| `npm run check`        | Typecheck, lint and format check: run before every PR |
| `npm run typecheck`    | TypeScript only                                       |
| `npm run lint`         | ESLint (Expo config)                                  |
| `npm run format`       | Formats every file with Prettier                      |
| `npm run format:check` | Checks formatting without changing files              |

CI runs `typecheck`, `lint`, `format:check` and an Android bundle build on every pull request to `main`.

## Environment and mock data

Copy `.env.example` to `.env.local` (git-ignored) to change these, then restart `npm run dev`:

| Variable                    | Default                 | Meaning                                         |
| --------------------------- | ----------------------- | ----------------------------------------------- |
| `EXPO_PUBLIC_API_URL`       | `http://localhost:9222` | Backend gateway                                 |
| `EXPO_PUBLIC_USE_MOCKS`     | `true`                  | `true` = JSON files in `mobile-mock-api/`       |
| `EXPO_PUBLIC_MOCK_SCENARIO` | `normal`                | `normal`, `empty`, `error` or `expired` (below) |

| Scenario  | Data                                        |
| --------- | ------------------------------------------- |
| `normal`  | Sara Benali, full history                   |
| `empty`   | Lina Tazi, new patient, every list empty    |
| `error`   | Every data call fails with a 500            |
| `expired` | Login works, the silent token refresh fails |

In mock mode, "now" is 29 Oct 2026 10:15: always use `now()` from `shared/lib/clock` to compare with API dates. The mock API itself is documented in [mobile-mock-api/README.md](mobile-mock-api/README.md).

## Project structure

```
app/                  Expo Router screens (routes)
components/ui/        Shared UI components (React Native Reusables)
features/
  auth/               Login, session, password            Mohammed KASMI
  home/               Accueil                             Ibrahim OUSGHIR
  profile/            Profil, Mes informations, notifications   Ibrahim OUSGHIR
  appointments/       Rendez-vous, booking                Mohammed Amine SABOUNI
  record/             Consultations, reports, X-rays, lab results   Abdessamad EL GAHSS
shared/
  api/                HTTP client and ApiError
  config/             Environment
  lib/                Clock, JWT, secure storage
  mocks/              Mock registry and helpers
  store/              Settings store and store helpers
mobile-mock-api/      Mock backend responses (JSON)
```

Inside a feature: `types.ts` (data shapes), `services/` (API calls, mock or real), `store/` (Zustand). Screens read stores; they never import mock files.

## UI components

Shared components come from [React Native Reusables](https://reactnativereusables.com). Add one with:

```bash
npx @react-native-reusables/cli@latest add <component>
```

It lands in `components/ui/`. Build a custom component only when RNR has none (date strip, slot grid, stepper, lab range bar). Only Mohammed merges changes to `components/ui/`.

## Team workflow

- One branch per task: `feature/<TASK-ID>-short-name`, e.g. `feature/R07-slot-grid`.
- The pull request title starts with the task ID, e.g. `R07 · Choisir un créneau`.
- `npm run check` must pass. One teammate reviews every pull request; Mohammed reviews anything touching shared components, navigation, `shared/` or `features/auth/`.
- Patients never see an AI prediction: no risk level, no confidence, and an X-ray shows a result only once the radiologist has validated it.

| Member                 | Area                                  | Tasks   |
| ---------------------- | ------------------------------------- | ------- |
| Mohammed KASMI         | Tech lead, foundation, authentication | F01–F12 |
| Ibrahim OUSGHIR        | Accueil, notifications, profile       | H01–H09 |
| Mohammed Amine SABOUNI | Appointments and booking              | R01–R10 |
| Abdessamad EL GAHSS    | Medical record                        | D01–D10 |
