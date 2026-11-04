import { errorMessage } from '@/shared/api/types';

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

/** One loadable piece of data. Each screen section owns one, so it can load and fail on its own. */
export type Resource<T> = {
  data: T;
  status: AsyncStatus;
  error: string | null;
};

export function idleResource<T>(data: T): Resource<T> {
  return { data, status: 'idle', error: null };
}

/**
 * Runs `fetcher` and reports loading → success | error through `update`.
 * On error the previous data is kept, so a failed refresh does not blank the screen.
 */
export async function loadResource<T>(
  current: Resource<T>,
  update: (next: Resource<T>) => void,
  fetcher: () => Promise<T>
): Promise<void> {
  update({ data: current.data, status: 'loading', error: null });
  try {
    update({ data: await fetcher(), status: 'success', error: null });
  } catch (error) {
    update({ data: current.data, status: 'error', error: errorMessage(error) });
  }
}
