import { ApiError, isEnvelope, toApiError } from '@/shared/api/types';
import { env } from '@/shared/config/env';

type ClientHooks = {
  getAccessToken: () => string | null;
  /** Called once on a 401. Resolve true if the token was refreshed and the call can be retried. */
  onUnauthorized: () => Promise<boolean>;
};

let hooks: ClientHooks = {
  getAccessToken: () => null,
  onUnauthorized: async () => false,
};

/** Wired by the auth store, so the client never imports a store. */
export function configureApiClient(next: ClientHooks) {
  hooks = next;
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  /** Send the bearer token and retry once after a refresh on 401. Default true. */
  auth?: boolean;
};

function parseBody(text: string): unknown {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text; // some rdv errors (404, 409) are plain text
  }
}

/**
 * Calls the gateway and returns the payload: `data` for envelope services,
 * the body itself for raw services (rapport, Radio, analyse).
 * Throws ApiError for every failure.
 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  return send<T>(path, options, false);
}

async function send<T>(path: string, options: RequestOptions, isRetry: boolean): Promise<T> {
  const { method = 'GET', body, auth = true } = options;
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = auth ? hooks.getAccessToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${env.apiUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'Network request failed');
  }

  if (response.status === 401 && auth && !isRetry && (await hooks.onUnauthorized())) {
    return send<T>(path, options, true);
  }

  const payload = parseBody(await response.text());
  if (!response.ok) throw toApiError(response.status, payload);

  if (isEnvelope(payload)) {
    if (!payload.success) throw toApiError(response.status, payload);
    return payload.data as T;
  }
  return payload as T;
}
