import type { AccessTokenClaims, AuthTokens, LoginRequest } from '@/features/auth/types';
import { request } from '@/shared/api/client';
import { env } from '@/shared/config/env';
import { decodeJwtPayload } from '@/shared/lib/jwt';
import { mockFail, mockOk } from '@/shared/mocks/mockApi';
import { mocks } from '@/shared/mocks/registry';

const NEW_PATIENT_ID = 3; // Lina Tazi in the mock data

export const authService = {
  /** Mock mode accepts only the credentials from POST_auth_login.request.json. */
  login(email: string, password: string): Promise<AuthTokens> {
    const body: LoginRequest = { username: email.trim(), password };
    if (env.useMocks) {
      const expected: LoginRequest = mocks.auth.loginRequest;
      const valid = body.username === expected.username && body.password === expected.password;
      return valid ? mockOk(mocks.auth.login) : mockFail(500, mocks.auth.loginBadCredentials);
    }
    return request<AuthTokens>('/auth/login', { method: 'POST', body, auth: false });
  },

  refresh(refreshToken: string): Promise<AuthTokens> {
    if (env.useMocks) {
      return env.mockScenario === 'expired'
        ? mockFail(500, mocks.auth.refreshExpired)
        : mockOk(mocks.auth.refresh);
    }
    return request<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
      auth: false,
    });
  },

  /** The mock tokens are not real JWTs, so mock mode reads the decoded payload file. */
  readClaims(accessToken: string): AccessTokenClaims {
    if (env.useMocks) {
      const claims: AccessTokenClaims = mocks.auth.accessTokenClaims;
      return env.mockScenario === 'empty' ? { ...claims, internalId: NEW_PATIENT_ID } : claims;
    }
    return decodeJwtPayload<AccessTokenClaims>(accessToken);
  },
};
