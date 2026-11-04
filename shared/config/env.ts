export type MockScenario = 'normal' | 'empty' | 'error' | 'expired';

const SCENARIOS: MockScenario[] = ['normal', 'empty', 'error', 'expired'];

function readScenario(value: string | undefined): MockScenario {
  return SCENARIOS.includes(value as MockScenario) ? (value as MockScenario) : 'normal';
}

/**
 * Runtime configuration, read from EXPO_PUBLIC_* variables (see .env.example).
 *
 * Mock scenarios:
 * - normal:  Sara Benali (patient 1), full history
 * - empty:   Lina Tazi (patient 3), new patient with empty lists
 * - error:   every data endpoint fails with a 500
 * - expired: login works, but the silent refresh fails (« Session expirée »)
 */
export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:9222',
  useMocks: process.env.EXPO_PUBLIC_USE_MOCKS !== 'false',
  mockScenario: readScenario(process.env.EXPO_PUBLIC_MOCK_SCENARIO),
  mockDelayMs: 400,
};
