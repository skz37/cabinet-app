export type ApiFieldError = {
  field: string | null;
  message: string;
};

/** Response wrapper used by auth, patient, medecin, rdv and consultation. */
export type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  messages?: string[];
  errors?: ApiFieldError[];
  timestamp: string;
};

/** The one error type every service throws. `status` is 0 when the network is unreachable. */
export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: ApiFieldError[];

  constructor(status: number, message: string, fieldErrors: ApiFieldError[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }

  get isNetworkError() {
    return this.status === 0;
  }
}

export const NETWORK_ERROR_MESSAGE = 'Connexion impossible. Vérifiez votre connexion internet.';
export const GENERIC_ERROR_MESSAGE = 'Une erreur est survenue. Réessayez.';

export function isEnvelope(payload: unknown): payload is ApiEnvelope<unknown> {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    typeof (payload as ApiEnvelope<unknown>).success === 'boolean' &&
    'timestamp' in payload
  );
}

/** Builds an ApiError from an error body: an envelope, plain text, or nothing. */
export function toApiError(status: number, payload: unknown): ApiError {
  if (isEnvelope(payload) && payload.errors?.length) {
    return new ApiError(status, payload.errors[0].message, payload.errors);
  }
  if (typeof payload === 'string' && payload.trim()) {
    return new ApiError(status, payload.trim());
  }
  return new ApiError(status, GENERIC_ERROR_MESSAGE);
}

/** A message safe to show to the patient. */
export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.isNetworkError) return NETWORK_ERROR_MESSAGE;
    if (error.status >= 500) return GENERIC_ERROR_MESSAGE;
    return error.message;
  }
  return GENERIC_ERROR_MESSAGE;
}
