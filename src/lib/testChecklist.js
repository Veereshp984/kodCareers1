export const TEST_STATUS_KEY = "jobTrackerTestStatus";

export const TEST_ITEMS = [
  {
    id: "preferences_persist",
    label: "Preferences persist after refresh",
    howToTest: "Update preferences in Settings, refresh, and confirm all fields remain prefilled."
  },
  {
    id: "match_score_correct",
    label: "Match score calculates correctly",
    howToTest: "Set known preferences and verify score components align with the scoring rules."
  },
  {
    id: "show_only_matches_toggle",
    label: "\"Show only matches\" toggle works",
    howToTest: "Enable the toggle and confirm low-score jobs below threshold disappear."
  },
  {
    id: "save_job_persist",
    label: "Save job persists after refresh",
    howToTest: "Save a job on Dashboard, refresh, then verify it remains in Saved."
  },
  {
    id: "apply_new_tab",
    label: "Apply opens in new tab",
    howToTest: "Click Apply and confirm a new browser tab opens to the job URL."
  },
  {
    id: "status_persist",
    label: "Status update persists after refresh",
    howToTest: "Set a status, refresh, and confirm the same status badge remains."
  },
  {
    id: "status_filter",
    label: "Status filter works correctly",
    howToTest: "Filter by each status and verify only matching jobs are shown."
  },
  {
    id: "digest_top10",
    label: "Digest generates top 10 by score",
    howToTest: "Generate digest and verify at most 10 jobs sorted by score then recency."
  },
  {
    id: "digest_daily_persist",
    label: "Digest persists for the day",
    howToTest: "Generate digest, refresh the page, and confirm same digest is loaded."
  },
  {
    id: "no_console_errors",
    label: "No console errors on main pages",
    howToTest: "Open browser console and navigate dashboard, saved, digest, settings."
  }
];

function defaultStatusMap() {
  return TEST_ITEMS.reduce((acc, item) => {
    acc[item.id] = false;
    return acc;
  }, {});
}

function parseStatusMap(raw) {
  try {
    const parsed = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== "object") {
      return defaultStatusMap();
    }

    const defaults = defaultStatusMap();
    TEST_ITEMS.forEach((item) => {
      defaults[item.id] = Boolean(parsed[item.id]);
    });
    return defaults;
  } catch (error) {
    return defaultStatusMap();
  }
}

export function getTestStatusMap() {
  if (typeof window === "undefined") {
    return defaultStatusMap();
  }

  const raw = window.localStorage.getItem(TEST_STATUS_KEY);
  return parseStatusMap(raw);
}

export function saveTestStatusMap(statusMap) {
  if (typeof window === "undefined") {
    return;
  }

  const safeMap = defaultStatusMap();
  TEST_ITEMS.forEach((item) => {
    safeMap[item.id] = Boolean(statusMap[item.id]);
  });
  window.localStorage.setItem(TEST_STATUS_KEY, JSON.stringify(safeMap));
}

export function resetTestStatusMap() {
  const reset = defaultStatusMap();
  saveTestStatusMap(reset);
  return reset;
}

export function getPassedCount(statusMap) {
  return TEST_ITEMS.reduce((count, item) => count + (statusMap[item.id] ? 1 : 0), 0);
}

export function areAllTestsPassed(statusMap) {
  return getPassedCount(statusMap) === TEST_ITEMS.length;
}
