import { requirePatientId } from '@/features/auth/store/useAuthStore';
import { appointmentService } from '@/features/appointments/services/appointmentService';
import type { Medecin, RendezVous } from '@/features/appointments/types';
import { registerStoreReset } from '@/shared/store/resetRegistry';
import { idleResource, loadResource, type Resource } from '@/shared/store/resource';
import { create } from 'zustand';

// Owner: Mohammed Amine SABOUNI (R02–R10). Starter store: extend with slots and booking.
type AppointmentState = {
  medecins: Resource<Medecin[]>;
  appointments: Resource<RendezVous[]>;
  fetchMedecins: () => Promise<void>;
  fetchAppointments: () => Promise<void>;
  reset: () => void;
};

const initialState = {
  medecins: idleResource<Medecin[]>([]),
  appointments: idleResource<RendezVous[]>([]),
};

export const useAppointmentStore = create<AppointmentState>()((set, get) => ({
  ...initialState,
  fetchMedecins: () =>
    loadResource(get().medecins, (medecins) => set({ medecins }), appointmentService.getMedecins),
  fetchAppointments: () =>
    loadResource(
      get().appointments,
      (appointments) => set({ appointments }),
      () => appointmentService.getMyAppointments(requirePatientId())
    ),
  reset: () => set(initialState),
}));

registerStoreReset(() => useAppointmentStore.getState().reset());
