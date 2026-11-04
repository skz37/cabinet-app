// AI rule (Task plan, scope changes): the app never shows riskLevel or confidence,
// and a radio not yet VALIDATED carries no result at all. The *Dto types are the raw
// backend shapes and must only be read in services/recordService.ts, which strips them.

export type ConsultationType = 'NORMAL' | 'RADIO' | 'ANALYSES';

/** Raw GET /consultation/ item. Do not use outside the service. */
export type ConsultationDto = {
  id: number;
  idPatient: number;
  idMedecin: number;
  idRdv: number | null;
  type: ConsultationType;
  typeMaladie: string | null;
  confidence: number | null;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | null;
  /** null while the doctor has not filled the consultation yet. */
  observation: string | null;
  traitement: string | null;
  dateConsultation: string;
};

export type Consultation = Omit<ConsultationDto, 'confidence' | 'riskLevel'>;

export type TypeRapport = 'NORMAL' | 'RADIO' | 'ANALYSES';

/** GET /rapport/patient/{id} item (raw, no envelope). */
export type Rapport = {
  id: number;
  patientId: number;
  patientNom: string;
  patientPrenom: string;
  patientEmail: string;
  medecinId: number;
  medecinNom: string;
  medecinPrenom: string;
  medecinSpecialite: string;
  typeRapport: TypeRapport;
  dateRapport: string;
  typeMaladie: string | null;
  observations: string | null;
  traitement: string | null;
  diagnostic: string | null;
  consultationId: number | null;
  /** null while the PDF is being generated (« PDF en cours de génération »). */
  pdfFileUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RadioStatus = 'PENDING' | 'PREDICTED' | 'VALIDATED';

/** Raw GET /Radio/Patient/{id} item. Do not use outside the service. */
export type RadioDto = {
  id: number;
  patientId: number;
  radiologueId: number;
  dateRadio: string;
  fichierRadioUrl: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  status: RadioStatus;
  typeMaladie: string | null;
  confidence: number | null;
  riskLevel: string | null;
  heatmapUrl: string | null;
  notesRadiologue: string | null;
};

type RadioBase = Pick<
  RadioDto,
  | 'id'
  | 'patientId'
  | 'radiologueId'
  | 'dateRadio'
  | 'fichierRadioUrl'
  | 'notes'
  | 'createdAt'
  | 'updatedAt'
>;

/** PENDING / PREDICTED → « En cours d'analyse », image only. VALIDATED → confirmed result. */
export type Radio =
  | (RadioBase & { status: 'PENDING' | 'PREDICTED' })
  | (RadioBase & {
      status: 'VALIDATED';
      /** Disease confirmed by the radiologist. */
      typeMaladie: string | null;
      heatmapUrl: string | null;
      notesRadiologue: string | null;
    });

/** GET /analyse/ item (raw, no envelope). `null` = not measured. Units live in reference ranges. */
export type Analyse = {
  id: number;
  patientId: number;
  age: number;
  sexe: string;
  glycemieJeun: number | null;
  hemoglobine: number | null;
  globulesBlancs: number | null;
  cholesterolTotal: number | null;
  creatinine: number | null;
  tensionSystolique: number | null;
  tensionDiastolique: number | null;
  frequenceCardiaque: number | null;
  temperature: number | null;
  imc: number | null;
  dateAnalyse: string;
};
