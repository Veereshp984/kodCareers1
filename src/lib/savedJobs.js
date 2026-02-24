export const SAVED_JOBS_KEY = "jobNotification.savedJobs";

export function getSavedJobIds() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(SAVED_JOBS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

export function setSavedJobIds(ids) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(ids));
}

export function toggleSavedJobId(jobId) {
  const ids = getSavedJobIds();
  const hasId = ids.includes(jobId);
  const nextIds = hasId ? ids.filter((id) => id !== jobId) : [...ids, jobId];
  setSavedJobIds(nextIds);
  return nextIds;
}
