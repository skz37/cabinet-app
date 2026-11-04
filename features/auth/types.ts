/** POST /auth/login body. The backend calls the email field `username`. */
export type LoginRequest = {
  username: string;
  password: string;
};

/** POST /auth/login and POST /auth/refresh `data`. */
export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  /** Access token lifetime in seconds (300 on the current backend). */
  expiresIn: number;
};

/** The access token claims the app reads. */
export type AccessTokenClaims = {
  exp: number;
  email: string;
  given_name: string;
  family_name: string;
  /** Patient id used by every patient-scoped endpoint. */
  internalId: number;
  realm_access?: { roles: string[] };
};
