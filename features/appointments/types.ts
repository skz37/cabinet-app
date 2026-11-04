export type Specialite = 'GENERALISTE' | 'RADIOLOGUE';

/** GET /medecin/ item. */
export type Medecin = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  dateNaissance: string;
  role: 'MEDECIN';
  staffId: number;
  specialite: Specialite;
};

/**
 * GET /rdv/patient/{idPatient} item. `dateRdv` is a local date-time without
 * timezone (`2026-11-03T09:30:00`). There is no status field: compare `dateRdv`
 * with now() from shared/lib/clock to get À venir / Passé.
 */
export type RendezVous = {
  id: number;
  idPatient: number;
  idMedecin: number;
  dateRdv: string;
};
