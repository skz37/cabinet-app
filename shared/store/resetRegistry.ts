// Stores holding patient data register their reset here; logout calls resetAllStores()
// so the next person to sign in on the phone never sees the previous patient's data.
const resets = new Set<() => void>();

export function registerStoreReset(reset: () => void) {
  resets.add(reset);
}

export function resetAllStores() {
  resets.forEach((reset) => reset());
}
