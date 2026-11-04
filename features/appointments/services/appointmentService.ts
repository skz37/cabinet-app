import type { Medecin, RendezVous } from '@/features/appointments/types';
import { request } from '@/shared/api/client';
import { env } from '@/shared/config/env';
import { mockByScenario } from '@/shared/mocks/mockApi';
import { mocks } from '@/shared/mocks/registry';

// Owner: Mohammed Amine SABOUNI (R02). Add slots, create, reschedule and cancel here.
export const appointmentService = {
  getMedecins(): Promise<Medecin[]> {
    if (env.useMocks) {
      return mockByScenario({ normal: mocks.medecin.list });
    }
    return request<Medecin[]>('/medecin/');
  },

  getMyAppointments(patientId: number): Promise<RendezVous[]> {
    if (env.useMocks) {
      return mockByScenario({ normal: mocks.rdv.byPatient, empty: mocks.rdv.byPatientEmpty });
    }
    return request<RendezVous[]>(`/rdv/patient/${patientId}`);
  },
};
