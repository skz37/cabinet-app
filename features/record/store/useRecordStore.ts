import { requirePatientId } from '@/features/auth/store/useAuthStore';
import { recordService } from '@/features/record/services/recordService';
import type { Analyse, Consultation, Radio, Rapport } from '@/features/record/types';
import { registerStoreReset } from '@/shared/store/resetRegistry';
import { idleResource, loadResource, type Resource } from '@/shared/store/resource';
import { create } from 'zustand';

// Owner: Abdessamad EL GAHSS (D02–D10). Starter store: extend with detail screens and D10.
type RecordState = {
  consultations: Resource<Consultation[]>;
  rapports: Resource<Rapport[]>;
  radios: Resource<Radio[]>;
  analyses: Resource<Analyse[]>;
  fetchConsultations: () => Promise<void>;
  fetchRapports: () => Promise<void>;
  fetchRadios: () => Promise<void>;
  fetchAnalyses: () => Promise<void>;
  reset: () => void;
};

const initialState = {
  consultations: idleResource<Consultation[]>([]),
  rapports: idleResource<Rapport[]>([]),
  radios: idleResource<Radio[]>([]),
  analyses: idleResource<Analyse[]>([]),
};

export const useRecordStore = create<RecordState>()((set, get) => ({
  ...initialState,
  fetchConsultations: () =>
    loadResource(
      get().consultations,
      (consultations) => set({ consultations }),
      () => recordService.getConsultations(requirePatientId())
    ),
  fetchRapports: () =>
    loadResource(
      get().rapports,
      (rapports) => set({ rapports }),
      () => recordService.getRapports(requirePatientId())
    ),
  fetchRadios: () =>
    loadResource(
      get().radios,
      (radios) => set({ radios }),
      () => recordService.getRadios(requirePatientId())
    ),
  fetchAnalyses: () =>
    loadResource(
      get().analyses,
      (analyses) => set({ analyses }),
      () => recordService.getAnalyses(requirePatientId())
    ),
  reset: () => set(initialState),
}));

registerStoreReset(() => useRecordStore.getState().reset());
