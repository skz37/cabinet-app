import type { Patient } from '@/features/profile/types';
import { request } from '@/shared/api/client';
import { env } from '@/shared/config/env';
import { mockByScenario } from '@/shared/mocks/mockApi';
import { mocks } from '@/shared/mocks/registry';

// Owner: Ibrahim OUSGHIR (H02). Add updateProfile (PUT /auth/patient/update/{id}) here.
export const patientService = {
  getMe(): Promise<Patient> {
    if (env.useMocks) {
      return mockByScenario({ normal: mocks.patient.me, empty: mocks.patient.meNewPatient });
    }
    return request<Patient>('/patient/me');
  },
};
