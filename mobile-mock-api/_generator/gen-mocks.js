// Generates mock JSON responses for the MediFlow patient mobile app.
// Usage: node gen-mocks.js <output-dir>
const fs = require('fs');
const path = require('path');

const OUT = process.argv[2];
const TS = '2026-10-29T10:15:30.123456'; // mock "now"

// ---------- envelope helpers (match services/*/ApiResponse.java) ----------
const ok = (data, message) => ({ success: true, data, ...(message ? { messages: [message] } : {}), timestamp: TS });
const okMsg = (message) => ({ success: true, messages: [message], timestamp: TS });
const err = (message) => ({ success: false, errors: [{ field: null, message }], timestamp: TS });
const errFields = (list) => ({ success: false, errors: list.map(([field, message]) => ({ field, message })), timestamp: TS });

const files = {};
const put = (p, v) => { files[p] = v; };
const putText = (p, text) => { files[p] = { __text: text }; };

// ---------- patients ----------
const patient = { id: 1, nom: 'Benali', prenom: 'Sara', email: 'sara.benali@example.com', tel: '0612345678', dateNaissance: '1995-04-12' };
const otherPatient = { id: 2, nom: 'Ouazzani', prenom: 'Omar', email: 'omar.ouazzani@example.com', tel: '0677889900', dateNaissance: '1962-11-30' };
const newPatient = { id: 3, nom: 'Tazi', prenom: 'Lina', email: 'lina.tazi@example.com', tel: '0655443322', dateNaissance: '2001-01-08' };

// ---------- doctors ----------
const medecins = [
  { id: 1, nom: 'Alami', prenom: 'Youssef', email: 'y.alami@mediflow.ma', tel: '0661000001', dateNaissance: '1980-02-15', role: 'MEDECIN', staffId: 3, specialite: 'GENERALISTE' },
  { id: 2, nom: 'Idrissi', prenom: 'Karim', email: 'k.idrissi@mediflow.ma', tel: '0661000002', dateNaissance: '1978-09-03', role: 'MEDECIN', staffId: 5, specialite: 'RADIOLOGUE' },
  { id: 3, nom: 'El Fassi', prenom: 'Nadia', email: 'n.elfassi@mediflow.ma', tel: '0661000003', dateNaissance: '1986-06-21', role: 'MEDECIN', staffId: 7, specialite: 'GENERALISTE' },
  { id: 4, nom: 'Berrada', prenom: 'Hicham', email: 'h.berrada@mediflow.ma', tel: '0661000004', dateNaissance: '1975-12-01', role: 'MEDECIN', staffId: 9, specialite: 'GENERALISTE' },
  { id: 5, nom: 'Chraibi', prenom: 'Salma', email: 's.chraibi@mediflow.ma', tel: '0661000005', dateNaissance: '1990-03-17', role: 'MEDECIN', staffId: 11, specialite: 'RADIOLOGUE' },
  { id: 6, nom: 'Lahlou', prenom: 'Mehdi', email: 'm.lahlou@mediflow.ma', tel: '0661000006', dateNaissance: '1983-07-29', role: 'MEDECIN', staffId: 13, specialite: 'GENERALISTE' },
];
const med = (id) => medecins.find((m) => m.id === id);

// ---------- appointments (today = 2026-10-29) ----------
const rdvs = [
  // upcoming
  { id: 24, idPatient: 1, idMedecin: 1, dateRdv: '2026-10-29T15:30:00' }, // today, later
  { id: 22, idPatient: 1, idMedecin: 3, dateRdv: '2026-10-30T09:00:00' }, // tomorrow
  { id: 19, idPatient: 1, idMedecin: 2, dateRdv: '2026-11-05T11:00:00' },
  { id: 20, idPatient: 1, idMedecin: 4, dateRdv: '2026-11-19T16:30:00' }, // last slot of the day
  // past
  { id: 15, idPatient: 1, idMedecin: 1, dateRdv: '2026-10-29T08:30:00' }, // today, already passed
  { id: 13, idPatient: 1, idMedecin: 6, dateRdv: '2026-10-20T14:00:00' },
  { id: 9, idPatient: 1, idMedecin: 1, dateRdv: '2026-10-12T10:00:00' },
  { id: 6, idPatient: 1, idMedecin: 2, dateRdv: '2026-09-22T11:30:00' },
  { id: 4, idPatient: 1, idMedecin: 3, dateRdv: '2026-08-30T08:00:00' },
  { id: 2, idPatient: 1, idMedecin: 5, dateRdv: '2026-06-11T13:00:00' },
  { id: 1, idPatient: 1, idMedecin: 1, dateRdv: '2026-03-14T08:30:00' },
];
const otherRdvs = [{ id: 23, idPatient: 2, idMedecin: 1, dateRdv: '2026-10-31T10:00:00' }];

// ---------- consultations ----------
const C = (id, idMedecin, idRdv, type, typeMaladie, confidence, riskLevel, observation, traitement, dateConsultation, idPatient = 1) =>
  ({ id, idPatient, idMedecin, idRdv, type, typeMaladie, confidence, riskLevel, observation, traitement, dateConsultation });
const consultations = [
  C(31, 1, 15, 'NORMAL', null, null, null, null, null, '2026-10-29T08:35:00'), // just started: doctor has not filled it yet
  C(28, 6, 13, 'NORMAL', 'Lombalgie', null, null,
    'Douleur lombaire basse depuis 1 semaine, sans irradiation. Examen neurologique normal.',
    'Ibuprofène 400 mg 3 fois par jour pendant 5 jours. Kinésithérapie 10 séances.', '2026-10-20T14:25:00'),
  C(21, 1, 9, 'NORMAL', 'Angine', null, null,
    'Gorge irritée, fièvre légère (38.2°C) depuis 2 jours.',
    'Amoxicilline 1 g matin et soir pendant 7 jours. Paracétamol 1 g si fièvre.', '2026-10-12T10:20:00'),
  C(17, 2, 6, 'RADIO', 'Pneumonia', 0.91, 'HIGH',
    'Opacité alvéolaire du lobe inférieur droit, confirmée par le radiologue.',
    'Antibiothérapie et contrôle radiologique dans 3 semaines.', '2026-09-22T12:05:00'),
  C(12, 3, 4, 'ANALYSES', 'Prédiabète', 0.78, 'MEDIUM',
    'Glycémie à jeun légèrement élevée (1.18 g/L).',
    'Régime pauvre en sucres rapides, 30 min de marche par jour, contrôle dans 3 mois.', '2026-08-30T09:00:00'),
  C(8, 5, 2, 'RADIO', 'Normal', 0.96, 'LOW',
    'Radiographie thoracique sans anomalie.', 'Aucun traitement nécessaire.', '2026-06-11T13:40:00'),
  C(5, 1, null, 'ANALYSES', 'Bilan normal', 0.88, 'LOW',
    'Bilan sanguin de routine dans les normes.', 'Aucun traitement. Prochain bilan dans 6 mois.', '2026-03-14T09:30:00'),
  C(3, 1, 1, 'NORMAL', 'Rhinopharyngite', null, null,
    'Nez bouché, toux sèche, pas de fièvre.', 'Lavage nasal au sérum physiologique, repos.', '2026-03-14T08:50:00'),
];
const otherConsultations = [
  C(30, 1, null, 'NORMAL', 'Grippe', null, null, 'Courbatures, fièvre.', 'Repos, paracétamol.', '2026-10-20T15:00:00', 2),
  C(29, 2, null, 'RADIO', 'Tuberculosis', 0.82, 'HIGH', 'Lésions apicales.', 'Orientation vers pneumologie.', '2026-10-18T10:00:00', 2),
];

// ---------- reports ----------
const consult = (id) => consultations.find((c) => c.id === id);
const R = (id, cId, diagnostic, pdf) => {
  const c = consult(cId), m = med(c.idMedecin);
  return {
    id, patientId: 1, patientNom: patient.nom, patientPrenom: patient.prenom, patientEmail: patient.email,
    medecinId: m.id, medecinNom: m.nom, medecinPrenom: m.prenom, medecinSpecialite: m.specialite,
    typeRapport: c.type, dateRapport: c.dateConsultation, typeMaladie: c.typeMaladie,
    observations: c.observation, traitement: c.traitement, diagnostic, consultationId: c.id,
    pdfFileUrl: pdf ? `rapports/rapport_${id}.pdf` : null,
    createdAt: c.dateConsultation, updatedAt: c.dateConsultation,
  };
};
const rapports = [
  R(12, 28, 'Lombalgie commune', false), // PDF still being generated
  R(8, 21, 'Angine bactérienne', true),
  R(5, 17, 'Pneumonie du lobe inférieur droit', true),
  R(3, 12, 'Prédiabète', true),
  R(2, 8, 'Radiographie thoracique normale', true),
  R(1, 5, 'Bilan biologique normal', true),
];

// ---------- X-rays (RadioStatus: PENDING, PREDICTED, VALIDATED) ----------
const X = (id, radiologueId, dateRadio, notes, status, typeMaladie, confidence, riskLevel, notesRadiologue) => ({
  id, patientId: 1, radiologueId, dateRadio,
  fichierRadioUrl: `radios/radio_${id}.png`, notes,
  createdAt: dateRadio, updatedAt: dateRadio, status, typeMaladie, confidence, riskLevel,
  heatmapUrl: status === 'PENDING' ? null : `heatmaps/heatmap_${id}.png`, notesRadiologue,
});
const radios = [
  X(14, 5, '2026-10-29T09:10:00', 'Contrôle post-pneumonie', 'PENDING', null, null, null, null), // AI still running
  X(11, 2, '2026-10-27T16:00:00', 'Toux persistante', 'PREDICTED', 'Normal', 0.84, 'LOW', null), // waiting for radiologist
  X(7, 2, '2026-09-22T11:30:00', 'Fièvre et douleur thoracique', 'VALIDATED', 'Pneumonia', 0.91, 'HIGH', 'Résultat confirmé. Opacité du lobe inférieur droit.'),
  X(5, 5, '2026-06-11T13:00:00', 'Bilan pré-opératoire', 'VALIDATED', 'Normal', 0.96, 'LOW', 'Aucune anomalie.'),
  X(3, 2, '2026-03-02T10:00:00', 'Contact COVID', 'VALIDATED', 'Normal', 0.71, 'LOW', 'IA : COVID19 (0.55). Résultat modifié par le radiologue : Normal.'),
];

// ---------- lab results ----------
const A = (id, dateAnalyse, v, patientId = 1, age = 31, sexe = 'FEMME') => ({
  id, patientId, age, sexe,
  glycemieJeun: v[0], hemoglobine: v[1], globulesBlancs: v[2], cholesterolTotal: v[3], creatinine: v[4],
  tensionSystolique: v[5], tensionDiastolique: v[6], frequenceCardiaque: v[7], temperature: v[8], imc: v[9], dateAnalyse,
});
const analyses = [
  A(9, '2026-10-27T08:00:00', [1.05, 11.2, 11800, 2.1, 8.4, 132, 85, 96, 38.4, 23.6]), // several values out of range (infection)
  A(6, '2026-08-30T08:15:00', [1.18, 12.9, 7200, 1.95, 8.1, 125, 80, 74, 36.8, 23.4]), // glycemia slightly high
  A(4, '2026-06-10T08:30:00', [0.98, 13.1, 6800, 1.85, 7.8, 120, 78, 72, 36.7, 23.2]),
  A(2, '2026-03-14T08:40:00', [0.95, 13.4, 6500, 1.8, 7.9, 118, 76, 70, 36.6, 23.1]),
  A(10, '2026-10-28T09:00:00', [1.62, null, null, 2.6, null, 150, 95, 88, null, 29.8]), // partial lab: some values not measured
];
const otherAnalyses = [A(8, '2026-10-18T08:00:00', [1.4, 14.8, 9000, 2.4, 12.5, 145, 92, 80, 37.0, 27.5], 2, 63, 'HOMME')];

// ---------- free slots ----------
const daySlots = (date, taken = []) => {
  const out = [];
  for (let m = 8 * 60; m < 17 * 60; m += 30) {
    const hm = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
    if (!taken.includes(hm)) out.push(`${date}T${hm}:00`);
  }
  return out;
};

// ======================= files =======================

// ---- auth ----
const tokens = { accessToken: 'eyJhbGciOiJSUzI1NiJ9.MOCK_ACCESS_TOKEN.signature', refreshToken: 'eyJhbGciOiJIUzUxMiJ9.MOCK_REFRESH_TOKEN.signature', expiresIn: 300 };
put('auth/POST_auth_login.request.json', { username: patient.email, password: 'Patient@123' });
put('auth/POST_auth_login.response.json', ok(tokens, 'Login successful'));
put('auth/POST_auth_login.error-500-bad-credentials.json', err('Erreur serveur: Identifiants incorrects'));
put('auth/POST_auth_refresh.request.json', { refreshToken: tokens.refreshToken });
put('auth/POST_auth_refresh.response.json', ok({ ...tokens, accessToken: 'eyJhbGciOiJSUzI1NiJ9.MOCK_ACCESS_TOKEN_2.signature' }, 'Token refreshed successfully'));
put('auth/POST_auth_refresh.error-500-expired.json', err('Erreur serveur: Refresh token invalide ou expiré'));
put('auth/access-token.decoded-payload.json', {
  exp: 1793282730, iat: 1793282430, sub: '7b1c2f4e-91d2-4a8e-b0a3-5e8d2c6f1a90', email: patient.email,
  given_name: patient.prenom, family_name: patient.nom, preferred_username: patient.email,
  internalId: 1, realm_access: { roles: ['PATIENT', 'offline_access', 'default-roles-clinique'] },
});
const reg = { nom: newPatient.nom, prenom: newPatient.prenom, tel: newPatient.tel, email: newPatient.email, dateNaissance: newPatient.dateNaissance, password: 'Lina@2026' };
put('auth/POST_auth_patient_register.request.json', reg);
put('auth/POST_auth_patient_register.response.json', ok({ patient: newPatient, keycloakId: 'c4d1e8a2-6f3b-4b7e-9a1d-2e5f8c0b7d43', success: true }, 'Patient et compte créés avec succès'));
put('auth/POST_auth_patient_register.error-400-validation.json', errFields([
  ['nom', 'nom obligatoire'],
  ['tel', 'Le numéro de téléphone doit etre correcte'],
  ['email', 'must be a well-formed email address'],
  ['dateNaissance', 'La date de naissance doit être dans le passé'],
  ['password', 'Le mot de passe est obligatoire'],
]));
put('auth/POST_auth_patient_register.error-500-email-exists.json', err('Erreur serveur: Erreur création compte Keycloak: HTTP 409 Conflict'));
put('auth/PUT_auth_patient_update_{id}.request.json', { nom: patient.nom, prenom: patient.prenom, tel: '0698765432', email: patient.email, dateNaissance: patient.dateNaissance, password: null });
put('auth/PUT_auth_patient_update_{id}.request.change-password.json', { nom: patient.nom, prenom: patient.prenom, tel: patient.tel, email: patient.email, dateNaissance: patient.dateNaissance, password: 'NouveauMdp@2026' });
put('auth/PUT_auth_patient_update_{id}.response.json', ok({ patient: { ...patient, tel: '0698765432' }, keycloakId: '7b1c2f4e-91d2-4a8e-b0a3-5e8d2c6f1a90', success: true }, 'Patient et compte mis à jour avec succès'));
put('auth/PUT_auth_patient_update_{id}.error-400-validation.json', errFields([['tel', 'Le numéro de téléphone doit etre correcte']]));

// ---- patient ----
put('patient/GET_patient_me.response.json', ok(patient));
put('patient/GET_patient_me.new-patient.json', ok(newPatient));
put('patient/GET_patient_me.error-404.json', err('Patient introuvable'));

// ---- medecin ----
put('medecin/GET_medecin.response.json', ok(medecins));
put('medecin/GET_medecin.empty.json', ok([]));
for (const m of medecins) put(`medecin/by-id/${m.id}.json`, ok(m));
put('medecin/GET_medecin_{id}.error-404.json', err('Medecin introuvable avec id: 99'));

// ---- rdv ----
put('rdv/GET_rdv_patient_{idPatient}.response.json', ok(rdvs));
put('rdv/GET_rdv_patient_{idPatient}.empty.json', ok([]));
putText('rdv/GET_rdv_patient_{idPatient}.error-404.txt', 'Patient avec id 99 introuvable');
for (const r of rdvs) put(`rdv/by-id/${r.id}.json`, ok(r));
put('rdv/GET_rdv_{id}.error-404.json', err("Aucun rdv n'existe avec id: 99"));
put('rdv/GET_rdv.response.json', ok([...rdvs, ...otherRdvs]));

put('rdv/GET_rdv_disponibilites_{idMedecin}.response.json', ok(daySlots('2026-11-03', ['09:30', '11:00', '14:00'])));
put('rdv/disponibilites/2026-10-29_today-afternoon.json', ok(daySlots('2026-10-29').filter((s) => s >= '2026-10-29T10:30:00' && s !== '2026-10-29T15:30:00')));
put('rdv/disponibilites/2026-10-30_almost-full.json', ok(['2026-10-30T12:00:00', '2026-10-30T16:30:00']));
put('rdv/disponibilites/2026-11-02_all-free.json', ok(daySlots('2026-11-02')));
put('rdv/disponibilites/2026-11-03_some-taken.json', ok(daySlots('2026-11-03', ['09:30', '11:00', '14:00'])));
put('rdv/disponibilites/2026-11-04_full.json', ok([]));
putText('rdv/GET_rdv_disponibilites_{idMedecin}.error-404.txt', 'Médecin avec id 99 introuvable');

const newRdv = { idPatient: 1, idMedecin: 1, dateRdv: '2026-11-03T10:30:00' };
put('rdv/POST_rdv_create.request.json', newRdv);
put('rdv/POST_rdv_create.response.json', ok({ id: 25, ...newRdv }, 'rdv creee avec succes.'));
putText('rdv/POST_rdv_create.error-409-slot-taken.txt', 'Ce créneau est déjà réservé pour ce médecin');
put('rdv/POST_rdv_create.error-400-outside-hours.json', err('Le RDV doit être entre 08h00 et 17h00.'));
put('rdv/POST_rdv_create.error-400-not-30min.json', err('Le RDV doit être sur un créneau de 30 minutes (ex: 09h00 ou 09h30).'));
put('rdv/POST_rdv_create.error-400-date-past.json', errFields([['dateRdv', 'la date doit etre au future']]));
putText('rdv/POST_rdv_create.error-404-medecin.txt', 'Médecin avec id 99 introuvable');
put('rdv/PUT_rdv_update_{id}.request.json', { ...newRdv, dateRdv: '2026-11-06T15:00:00' });
put('rdv/PUT_rdv_update_{id}.response.json', ok({ id: 25, ...newRdv, dateRdv: '2026-11-06T15:00:00' }, 'rdv modifie avec succes'));
putText('rdv/PUT_rdv_update_{id}.error-409-slot-taken.txt', 'Ce créneau est déjà réservé pour ce médecin');
put('rdv/DELETE_rdv_delete_{id}.response.json', okMsg('rdv supprime avec succes.'));
put('rdv/DELETE_rdv_delete_{id}.error-404.json', err("Aucun rdv n'existe avec id: 99"));

// ---- consultation ----
put('consultation/GET_consultation.response.json', ok([...consultations, ...otherConsultations]));
put('consultation/GET_consultation.empty.json', ok([]));
for (const c of consultations) put(`consultation/by-id/${c.id}.json`, ok(c));
put('consultation/GET_consultation_{id}.error-404.json', err('Consultation introuvable avec id: 99'));

// ---- rapport (raw) ----
put('rapport/GET_rapport_patient_{id}.response.json', rapports);
put('rapport/GET_rapport_patient_{id}.empty.json', []);
for (const r of rapports) put(`rapport/by-id/${r.id}.json`, r);

// ---- radio (raw) ----
put('radio/GET_Radio_Patient_{id}.response.json', radios);
put('radio/GET_Radio_Patient_{id}.empty.json', []);
for (const r of radios) put(`radio/by-id/${r.id}.json`, r);

// ---- analyse (raw) ----
put('analyse/GET_analyse.response.json', [...analyses, ...otherAnalyses]);
put('analyse/GET_analyse.empty.json', []);
for (const a of analyses) put(`analyse/by-id/${a.id}.json`, a);
put('analyse/reference-ranges.json', {
  _note: 'Not returned by the backend. Suggested normal ranges for the range bars (adult).',
  glycemieJeun: { unit: 'g/L', min: 0.7, max: 1.1 },
  hemoglobine: { unit: 'g/dL', min: 12, max: 16 },
  globulesBlancs: { unit: '/mm³', min: 4000, max: 10000 },
  cholesterolTotal: { unit: 'g/L', min: 1.5, max: 2.0 },
  creatinine: { unit: 'mg/L', min: 6, max: 12 },
  tensionSystolique: { unit: 'mmHg', min: 90, max: 130 },
  tensionDiastolique: { unit: 'mmHg', min: 60, max: 85 },
  frequenceCardiaque: { unit: 'bpm', min: 60, max: 100 },
  temperature: { unit: '°C', min: 36.1, max: 37.5 },
  imc: { unit: 'kg/m²', min: 18.5, max: 25 },
});

// ---- generic errors ----
putText('_errors/401-unauthorized.txt', '(empty body) — gateway returns HTTP 401 when the token is missing, invalid or expired. Call /auth/refresh then retry once.');
put('_errors/500-server-error.json', err('Erreur serveur: Une erreur interne est survenue'));
put('_errors/503-service-down.json', err('Erreur de communication avec le service Staff'));

// ---------- write ----------
for (const [rel, value] of Object.entries(files)) {
  const p = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, value.__text !== undefined ? value.__text + '\n' : JSON.stringify(value, null, 2) + '\n', 'utf8');
}
console.log(Object.keys(files).length + ' files written');
