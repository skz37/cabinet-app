import type {
  Analyse,
  Consultation,
  ConsultationDto,
  Radio,
  RadioDto,
  Rapport,
} from '@/features/record/types';
import { request } from '@/shared/api/client';
import { env } from '@/shared/config/env';
import { mockByScenario } from '@/shared/mocks/mockApi';
import { mocks } from '@/shared/mocks/registry';

// Owner: Abdessamad EL GAHSS (D02). Add the by-id calls and PDF / image downloads here.

/** Drops the AI prediction fields; they must never reach a screen. */
function toConsultation({ confidence, riskLevel, ...consultation }: ConsultationDto): Consultation {
  return consultation;
}

/** Only a VALIDATED radio exposes a result; anything else is image-only. */
function toRadio(dto: RadioDto): Radio {
  const { id, patientId, radiologueId, dateRadio, fichierRadioUrl, notes, createdAt, updatedAt } =
    dto;
  const base = {
    id,
    patientId,
    radiologueId,
    dateRadio,
    fichierRadioUrl,
    notes,
    createdAt,
    updatedAt,
  };
  if (dto.status === 'VALIDATED') {
    return {
      ...base,
      status: 'VALIDATED',
      typeMaladie: dto.typeMaladie,
      heatmapUrl: dto.heatmapUrl,
      notesRadiologue: dto.notesRadiologue,
    };
  }
  return { ...base, status: dto.status };
}

export const recordService = {
  /** GET /consultation/ returns every patient's consultations: keep only ours. */
  async getConsultations(patientId: number): Promise<Consultation[]> {
    const all = env.useMocks
      ? await mockByScenario<ConsultationDto[]>({
          normal: mocks.consultation.list,
          empty: mocks.consultation.listEmpty,
        })
      : await request<ConsultationDto[]>('/consultation/');
    return all.filter((c) => c.idPatient === patientId).map(toConsultation);
  },

  getRapports(patientId: number): Promise<Rapport[]> {
    if (env.useMocks) {
      return mockByScenario({
        normal: mocks.rapport.byPatient,
        empty: mocks.rapport.byPatientEmpty,
      });
    }
    return request<Rapport[]>(`/rapport/patient/${patientId}`);
  },

  async getRadios(patientId: number): Promise<Radio[]> {
    const all = env.useMocks
      ? await mockByScenario<RadioDto[]>({
          normal: mocks.radio.byPatient,
          empty: mocks.radio.byPatientEmpty,
        })
      : await request<RadioDto[]>(`/Radio/Patient/${patientId}`);
    return all.map(toRadio);
  },

  /** GET /analyse/ returns every patient's results: keep only ours. */
  async getAnalyses(patientId: number): Promise<Analyse[]> {
    const all = env.useMocks
      ? await mockByScenario<Analyse[]>({
          normal: mocks.analyse.list,
          empty: mocks.analyse.listEmpty,
        })
      : await request<Analyse[]>('/analyse/');
    return all.filter((a) => a.patientId === patientId);
  },
};
