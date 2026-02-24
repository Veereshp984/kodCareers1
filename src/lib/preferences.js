export const PREFERENCES_KEY = "jobTrackerPreferences";

export const DEFAULT_PREFERENCES = {
  roleKeywords: [],
  preferredLocations: [],
  preferredMode: [],
  experienceLevel: "",
  skills: [],
  minMatchScore: 40
};

function sanitizeStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => String(item).trim())
    .filter(Boolean);
}

export function parseCommaSeparated(text) {
  return String(text || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getPreferences() {
  if (typeof window === "undefined") {
    return DEFAULT_PREFERENCES;
  }

  try {
    const raw = window.localStorage.getItem(PREFERENCES_KEY);
    if (!raw) {
      return DEFAULT_PREFERENCES;
    }

    const parsed = JSON.parse(raw);
    const minScore = Number(parsed.minMatchScore);

    return {
      roleKeywords: sanitizeStringArray(parsed.roleKeywords),
      preferredLocations: sanitizeStringArray(parsed.preferredLocations),
      preferredMode: sanitizeStringArray(parsed.preferredMode),
      experienceLevel: typeof parsed.experienceLevel === "string" ? parsed.experienceLevel : "",
      skills: sanitizeStringArray(parsed.skills),
      minMatchScore: Number.isFinite(minScore) ? Math.min(100, Math.max(0, minScore)) : 40
    };
  } catch (error) {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(preferences) {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = {
    roleKeywords: sanitizeStringArray(preferences.roleKeywords),
    preferredLocations: sanitizeStringArray(preferences.preferredLocations),
    preferredMode: sanitizeStringArray(preferences.preferredMode),
    experienceLevel: preferences.experienceLevel || "",
    skills: sanitizeStringArray(preferences.skills),
    minMatchScore: Math.min(100, Math.max(0, Number(preferences.minMatchScore) || 40))
  };

  window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(normalized));
}

export function hasSavedPreferences() {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(window.localStorage.getItem(PREFERENCES_KEY));
}
