import { patientService } from '@/features/profile/services/patientService';
import type { Patient } from '@/features/profile/types';
import { registerStoreReset } from '@/shared/store/resetRegistry';
import { idleResource, loadResource, type Resource } from '@/shared/store/resource';
import { create } from 'zustand';

// Owner: Ibrahim OUSGHIR (H02–H04). Starter store: extend with profile editing.
type PatientState = {
  profile: Resource<Patient | null>;
  fetchProfile: () => Promise<void>;
  reset: () => void;
};

const initialState = {
  profile: idleResource<Patient | null>(null),
};

export const usePatientStore = create<PatientState>()((set, get) => ({
  ...initialState,
  fetchProfile: () =>
    loadResource(get().profile, (profile) => set({ profile }), patientService.getMe),
  reset: () => set(initialState),
}));

registerStoreReset(() => usePatientStore.getState().reset());
