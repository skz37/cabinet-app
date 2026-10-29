# MediFlow Patient App — Mock API

These are example responses for every endpoint the patient mobile app uses, so you can build the app without deploying the backend. The shapes match the DTOs and exception handlers in `services/`. When the real API is up, call the gateway at `http://<host>:9222` instead.

To change the data, edit `_generator/gen-mocks.js`, then run it from this folder: `node _generator/gen-mocks.js .`

## Conventions

- **File names:** `METHOD_path_{param}.<kind>.json`. `<kind>` is one of:
  - `request`
  - `response` (the normal case)
  - `empty`
  - `new-patient`
  - `error-<status>-<case>`
- **`by-id/<id>.json`:** the `GET /…/{id}` response for each record in the lists.
- **`.txt` files:** the backend returns plain text, not JSON, in these cases (see Errors).
- **Mock "now":** 2026-10-29 10:15. The upcoming/past split is based on it.
- **Dates:** `LocalDateTime` values look like `2026-11-03T09:30:00` (no timezone). `LocalDate` values look like `1995-04-12`.

## Response formats

| Format | Success shape | Error shape | Services |
|---|---|---|---|
| Envelope | `{ success: true, data, messages?, timestamp }` | `{ success: false, errors: [{ field, message }], timestamp }` | auth, patient, medecin, rdv, consultation |
| Raw | the DTO or a list of DTOs | — | rapport, Radio, analyse |

- **Error messages:** they are in `errors[].message`, not `messages`. `field` is `null` unless the error is a validation error.
- **Delete responses:** the confirmation text is in `messages[0]` and there is no `data`.

## Mock people

| Who | id | Notes |
|---|---|---|
| Sara Benali (signed-in patient) | 1 | Full history |
| Omar Ouazzani | 2 | Another patient. His records appear in `GET /consultation/`, `GET /rdv/` and `GET /analyse/`, and the app must filter them out |
| Lina Tazi | 3 | Newly registered, no history. Use the `.empty.json` and `.new-patient.json` files |
| Dr Youssef Alami · Dr Nadia El Fassi · Dr Hicham Berrada · Dr Mehdi Lahlou | 1, 3, 4, 6 | Généraliste |
| Dr Karim Idrissi · Dr Salma Chraibi | 2, 5 | Radiologue |

## Endpoint index

| Feature | Method + path | Format | Files |
|---|---|---|---|
| Login | `POST /auth/login` | envelope | `auth/POST_auth_login.*` |
| Refresh | `POST /auth/refresh` | envelope | `auth/POST_auth_refresh.*` |
| Token claims | decoded JWT | — | `auth/access-token.decoded-payload.json` (`internalId` = patient id) |
| Sign up | `POST /auth/patient/register` | envelope | `auth/POST_auth_patient_register.*` |
| Edit profile / password | `PUT /auth/patient/update/{id}` | envelope | `auth/PUT_auth_patient_update_{id}.*` (`password: null` = unchanged) |
| My profile | `GET /patient/me` | envelope | `patient/GET_patient_me.*` |
| Doctors | `GET /medecin/`, `GET /medecin/{id}` | envelope | `medecin/GET_medecin.*`, `medecin/by-id/` |
| My appointments | `GET /rdv/patient/{idPatient}` | envelope | `rdv/GET_rdv_patient_{idPatient}.*` |
| All appointments | `GET /rdv/` | envelope | `rdv/GET_rdv.response.json` (contains other patients' appointments) |
| Appointment detail | `GET /rdv/{id}` | envelope | `rdv/by-id/` |
| Free slots | `GET /rdv/disponibilites/{idMedecin}?date=yyyy-MM-dd` | envelope | `rdv/disponibilites/<date>_<case>.json` |
| Book | `POST /rdv/create` | envelope | `rdv/POST_rdv_create.*` |
| Reschedule | `PUT /rdv/update/{id}` | envelope | `rdv/PUT_rdv_update_{id}.*` |
| Cancel | `DELETE /rdv/delete/{id}` | envelope | `rdv/DELETE_rdv_delete_{id}.*` |
| Consultations | `GET /consultation/`, `GET /consultation/{id}` | envelope | `consultation/GET_consultation.*`, `consultation/by-id/` |
| Reports | `GET /rapport/patient/{id}`, `GET /rapport/{id}` | raw | `rapport/GET_rapport_patient_{id}.*`, `rapport/by-id/` |
| Report PDF | `GET /rapport/{id}/download` | binary | none; use any sample PDF |
| X-rays | `GET /Radio/Patient/{id}`, `GET /Radio/{id}` | raw | `radio/GET_Radio_Patient_{id}.*`, `radio/by-id/` |
| X-ray image / heatmap | `GET /Radio/{id}/download`, `/Radio/{id}/heatmap/download` | binary | none; use any sample PNG |
| Lab results | `GET /analyse/`, `GET /analyse/{id}` | raw | `analyse/GET_analyse.*`, `analyse/by-id/` |
| Lab normal ranges | — (not in the backend) | — | `analyse/reference-ranges.json` |

## Data cases to design and test against

| Area | Case | Where |
|---|---|---|
| Appointments | Later today (15:30) | rdv `24` |
| Appointments | Tomorrow | rdv `22` |
| Appointments | Last slot of the day (16:30) | rdv `20` |
| Appointments | Earlier today, already passed | rdv `15` |
| Appointments | 7 past appointments spread over 2026 | rdv `13, 9, 6, 4, 2, 1` |
| Free slots | All 18 slots free | `disponibilites/2026-11-02_all-free.json` |
| Free slots | 3 slots taken | `disponibilites/2026-11-03_some-taken.json` |
| Free slots | 2 left | `disponibilites/2026-10-30_almost-full.json` |
| Free slots | Fully booked | `disponibilites/2026-11-04_full.json` |
| Free slots | Today, past hours removed | `disponibilites/2026-10-29_today-afternoon.json` |
| Consultations | Just started: observation and treatment are still `null` | consultation `31` |
| Consultations | Types NORMAL, RADIO and ANALYSES; risk LOW, MEDIUM and HIGH | consultations `28, 17, 12, 8, 5, 3` |
| Consultations | Not linked to an appointment (`idRdv: null`) | consultation `5` |
| Reports | PDF not generated yet (`pdfFileUrl: null`) | rapport `12` |
| Reports | One report of each type | rapports `8, 5, 3, 2, 1` |
| X-rays | `PENDING`: AI still running, no result, no heatmap | radio `14` |
| X-rays | `PREDICTED`: AI done, waiting for the radiologist; hide the diagnosis | radio `11` |
| X-rays | `VALIDATED` with a high-risk diagnosis (Pneumonia) | radio `7` |
| X-rays | `VALIDATED` and normal | radio `5` |
| X-rays | `VALIDATED` after the radiologist changed the AI result | radio `3` |
| Lab results | Several values out of range (infection) | analyse `9` |
| Lab results | One value slightly high (glycemia) | analyse `6` |
| Lab results | Partial test: some values are `null` (not measured) | analyse `10` |
| Lab results | Normal | analyses `4, 2` |
| Everything | Empty lists for a new patient | all `.empty.json` files |

AI disease labels (`typeMaladie` on radio results) come from `AI-radio/model.py`: `COVID19`, `Normal`, `Pneumonia`, `Tuberculosis`.

## Errors

| Case | Status | Body | File |
|---|---|---|---|
| Wrong email or password | **500** (not 401) | envelope | `auth/POST_auth_login.error-500-bad-credentials.json` |
| Refresh token expired | 500 | envelope | `auth/POST_auth_refresh.error-500-expired.json` |
| Sign-up: invalid fields | 400 | envelope with one entry per field | `auth/POST_auth_patient_register.error-400-validation.json` |
| Sign-up: email already used | 500 | envelope | `auth/POST_auth_patient_register.error-500-email-exists.json` |
| Booking: slot already taken | 409 | **plain text** | `rdv/POST_rdv_create.error-409-slot-taken.txt` |
| Booking: outside 08:00–17:00 | 400 | envelope | `rdv/POST_rdv_create.error-400-outside-hours.json` |
| Booking: not on :00 or :30 | 400 | envelope | `rdv/POST_rdv_create.error-400-not-30min.json` |
| Booking: date in the past | 400 | envelope (`field: dateRdv`) | `rdv/POST_rdv_create.error-400-date-past.json` |
| Doctor or patient not found (rdv) | 404 | **plain text** | `rdv/*error-404*.txt` |
| Record not found | 404 | envelope | `*/…error-404.json` |
| Missing or expired token | 401 | empty body | `_errors/401-unauthorized.txt`: refresh the token, then retry once |
| A downstream service is down | 500 | envelope | `_errors/503-service-down.json` |
| Unexpected server error | 500 | envelope | `_errors/500-server-error.json` |

Some messages are best guesses because the backend builds them at runtime: refresh expired, email already used, and the patient, doctor and consultation not-found messages. The other messages are copied from the source.

## Backend gaps

- **`/analyse/**`:** has no route on the gateway, and the endpoint returns every patient's lab results.
- **`/auth/patient/register`:** the gateway still requires a token for it.
- **Login with wrong credentials:** returns 500 instead of 401.
