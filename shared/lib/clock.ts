import { env } from '@/shared/config/env';

// The mock data is built around this moment (see mobile-mock-api/README.md).
const MOCK_NOW = new Date('2026-10-29T10:15:00').getTime();
const bootedAt = Date.now();

/**
 * Current time for business logic (upcoming vs past, free slots, "dans 2 jours").
 * In mock mode the clock starts at the mock "now" and keeps ticking from there.
 * Always use this instead of `new Date()` when comparing against API dates.
 */
export function now(): Date {
  return env.useMocks ? new Date(MOCK_NOW + (Date.now() - bootedAt)) : new Date();
}
