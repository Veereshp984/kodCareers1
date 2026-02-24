export const JOB_STATUS_KEY = "jobTrackerStatus";
export const JOB_STATUS_UPDATES_KEY = "jobTrackerStatusUpdates";

export const JOB_STATUS = {
  NOT_APPLIED: "Not Applied",
  APPLIED: "Applied",
  REJECTED: "Rejected",
  SELECTED: "Selected"
};

export const JOB_STATUS_OPTIONS = [
  JOB_STATUS.NOT_APPLIED,
  JOB_STATUS.APPLIED,
  JOB_STATUS.REJECTED,
  JOB_STATUS.SELECTED
];

function parseObject(raw) {
  try {
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    return {};
  }
}

export function getStatusMap() {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(JOB_STATUS_KEY);
  return parseObject(raw);
}

export function getJobStatus(jobId, statusMap = null) {
  const map = statusMap || getStatusMap();
  const status = map[jobId];
  return JOB_STATUS_OPTIONS.includes(status) ? status : JOB_STATUS.NOT_APPLIED;
}

export function setJobStatus(jobId, status) {
  if (typeof window === "undefined") {
    return getStatusMap();
  }

  const safeStatus = JOB_STATUS_OPTIONS.includes(status) ? status : JOB_STATUS.NOT_APPLIED;
  const nextMap = { ...getStatusMap(), [jobId]: safeStatus };
  window.localStorage.setItem(JOB_STATUS_KEY, JSON.stringify(nextMap));
  return nextMap;
}

export function getStatusUpdates() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(JOB_STATUS_UPDATES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

export function addStatusUpdate(update) {
  if (typeof window === "undefined") {
    return [];
  }

  const updates = getStatusUpdates();
  const next = [update, ...updates].slice(0, 50);
  window.localStorage.setItem(JOB_STATUS_UPDATES_KEY, JSON.stringify(next));
  return next;
}
