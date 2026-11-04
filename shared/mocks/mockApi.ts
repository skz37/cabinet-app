import { isEnvelope, toApiError } from '@/shared/api/types';
import { env } from '@/shared/config/env';
import { mocks } from '@/shared/mocks/registry';

const wait = () => new Promise((resolve) => setTimeout(resolve, env.mockDelayMs));

/** Resolves a mock file the same way the real client resolves a response body. */
export async function mockOk<T>(payload: unknown): Promise<T> {
  await wait();
  if (isEnvelope(payload)) {
    if (!payload.success) throw toApiError(500, payload);
    return payload.data as T;
  }
  return payload as T;
}

/** Rejects with the ApiError the real client would throw for this status and body. */
export async function mockFail(status: number, payload: unknown): Promise<never> {
  await wait();
  throw toApiError(status, payload);
}

/**
 * Picks the mock for the current scenario: the `.empty` file in "empty",
 * a 500 in "error", the normal file otherwise.
 */
export function mockByScenario<T>(files: { normal: unknown; empty?: unknown }): Promise<T> {
  switch (env.mockScenario) {
    case 'error':
      return mockFail(500, mocks.errors.serverError);
    case 'empty':
      return mockOk<T>(files.empty ?? files.normal);
    default:
      return mockOk<T>(files.normal);
  }
}
