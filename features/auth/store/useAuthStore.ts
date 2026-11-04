import { authService } from '@/features/auth/services/authService';
import type { AuthTokens } from '@/features/auth/types';
import { configureApiClient } from '@/shared/api/client';
import { ApiError, GENERIC_ERROR_MESSAGE, NETWORK_ERROR_MESSAGE } from '@/shared/api/types';
import { secureStorage } from '@/shared/lib/secureStorage';
import { resetAllStores } from '@/shared/store/resetRegistry';
import { create } from 'zustand';

const REFRESH_TOKEN_KEY = 'mediflow.refreshToken';
const REFRESH_MARGIN_MS = 2 * 60 * 1000; // refresh 2 minutes before the access token expires
const NETWORK_RETRY_MS = 30 * 1000;
const INVALID_CREDENTIALS_MESSAGE = 'Email ou mot de passe incorrect';

/**
 * - checking:        Splash is restoring the session
 * - authenticated:   tokens are valid
 * - unauthenticated: show Bienvenue / Connexion
 * - expired:         silent refresh failed, show « Session expirée » (F09)
 */
export type SessionStatus = 'checking' | 'authenticated' | 'unauthenticated' | 'expired';

type AuthState = {
  status: SessionStatus;
  /** Kept in memory only; the refresh token is the one stored in SecureStore. */
  accessToken: string | null;
  patientId: number | null;
  expiresAt: number | null;
  isSubmitting: boolean;
  loginError: string | null;

  /** Called by Splash: turns a stored refresh token into a session. */
  restoreSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  /** Silent refresh. Resolves false when the session could not be renewed. */
  refresh: () => Promise<boolean>;
  /** Clears tokens and every patient store, then returns to Connexion. */
  logout: () => Promise<void>;
  clearLoginError: () => void;
};

let refreshTimer: ReturnType<typeof setTimeout> | null = null;
let refreshInFlight: Promise<boolean> | null = null;

function scheduleRefresh(delayMs: number) {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => void useAuthStore.getState().refresh(), Math.max(0, delayMs));
}

function cancelRefresh() {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = null;
}

function loginErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) return GENERIC_ERROR_MESSAGE;
  if (error.isNetworkError) return NETWORK_ERROR_MESSAGE;
  // The backend answers wrong credentials with a 500 « Identifiants incorrects », not a 401.
  if (error.status === 401 || /identifiants/i.test(error.message)) {
    return INVALID_CREDENTIALS_MESSAGE;
  }
  return GENERIC_ERROR_MESSAGE;
}

export const useAuthStore = create<AuthState>()((set, get) => {
  async function applyTokens(tokens: AuthTokens) {
    const claims = authService.readClaims(tokens.accessToken);
    await secureStorage.set(REFRESH_TOKEN_KEY, tokens.refreshToken);
    const lifetimeMs = tokens.expiresIn * 1000;
    set({
      status: 'authenticated',
      accessToken: tokens.accessToken,
      patientId: claims.internalId,
      expiresAt: Date.now() + lifetimeMs,
    });
    scheduleRefresh(lifetimeMs - REFRESH_MARGIN_MS);
  }

  async function clearSession(status: SessionStatus) {
    cancelRefresh();
    await secureStorage.remove(REFRESH_TOKEN_KEY);
    set({ status, accessToken: null, patientId: null, expiresAt: null });
  }

  return {
    status: 'checking',
    accessToken: null,
    patientId: null,
    expiresAt: null,
    isSubmitting: false,
    loginError: null,

    restoreSession: async () => {
      const refreshToken = await secureStorage.get(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        set({ status: 'unauthenticated' });
        return;
      }
      try {
        await applyTokens(await authService.refresh(refreshToken));
      } catch (error) {
        // Offline at launch: keep the stored token so the next launch can retry.
        if (error instanceof ApiError && error.isNetworkError) {
          set({ status: 'unauthenticated' });
        } else {
          await clearSession('unauthenticated');
        }
      }
    },

    login: async (email, password) => {
      set({ isSubmitting: true, loginError: null });
      try {
        await applyTokens(await authService.login(email, password));
        return true;
      } catch (error) {
        set({ loginError: loginErrorMessage(error) });
        return false;
      } finally {
        set({ isSubmitting: false });
      }
    },

    refresh: () => {
      // Several 401s at once must share one refresh call.
      if (refreshInFlight) return refreshInFlight;
      refreshInFlight = (async () => {
        try {
          const refreshToken = await secureStorage.get(REFRESH_TOKEN_KEY);
          if (!refreshToken) throw new ApiError(401, 'No refresh token');
          await applyTokens(await authService.refresh(refreshToken));
          return true;
        } catch (error) {
          if (error instanceof ApiError && error.isNetworkError) {
            scheduleRefresh(NETWORK_RETRY_MS);
          } else if (get().status === 'authenticated') {
            await clearSession('expired');
          }
          return false;
        } finally {
          refreshInFlight = null;
        }
      })();
      return refreshInFlight;
    },

    logout: async () => {
      await clearSession('unauthenticated');
      resetAllStores();
      set({ loginError: null });
    },

    clearLoginError: () => set({ loginError: null }),
  };
});

/** Patient id for patient-scoped calls. Throws if nobody is signed in. */
export function requirePatientId(): number {
  const { patientId } = useAuthStore.getState();
  if (patientId === null) throw new ApiError(401, 'Veuillez vous reconnecter.');
  return patientId;
}

configureApiClient({
  getAccessToken: () => useAuthStore.getState().accessToken,
  onUnauthorized: () => useAuthStore.getState().refresh(),
});
