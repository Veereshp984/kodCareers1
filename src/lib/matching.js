function includesAny(text, terms) {
  if (!text || terms.length === 0) {
    return false;
  }

  const normalizedText = text.toLowerCase();
  return terms.some((term) => normalizedText.includes(term));
}

export function calculateMatchScore(job, preferences) {
  const roleKeywords = preferences.roleKeywords.map((item) => item.toLowerCase());
  const preferredLocations = preferences.preferredLocations.map((item) => item.toLowerCase());
  const preferredMode = preferences.preferredMode.map((item) => item.toLowerCase());
  const userSkills = preferences.skills.map((item) => item.toLowerCase());

  let score = 0;

  if (includesAny(job.title, roleKeywords)) {
    score += 25;
  }

  if (includesAny(job.description, roleKeywords)) {
    score += 15;
  }

  if (preferredLocations.includes(job.location.toLowerCase())) {
    score += 15;
  }

  if (preferredMode.includes(job.mode.toLowerCase())) {
    score += 10;
  }

  if (
    preferences.experienceLevel &&
    preferences.experienceLevel.toLowerCase() === job.experience.toLowerCase()
  ) {
    score += 10;
  }

  const hasSkillOverlap = job.skills.some((skill) => userSkills.includes(skill.toLowerCase()));
  if (hasSkillOverlap) {
    score += 15;
  }

  if (job.postedDaysAgo <= 2) {
    score += 5;
  }

  if (job.source === "LinkedIn") {
    score += 5;
  }

  return Math.min(100, score);
}

function extractNumbers(text) {
  const matches = String(text).match(/\d+(?:\.\d+)?/g);
  if (!matches) {
    return [];
  }

  return matches.map((item) => Number(item));
}

export function extractSalaryScore(salaryRange) {
  const value = String(salaryRange || "");
  const numbers = extractNumbers(value);
  if (numbers.length === 0) {
    return -1;
  }

  const midpoint = (numbers[0] + numbers[numbers.length - 1]) / 2;
  const lower = value.toLowerCase();

  if (lower.includes("lpa")) {
    return midpoint;
  }

  if (lower.includes("/month")) {
    if (lower.includes("k")) {
      return (midpoint * 12) / 100;
    }

    return (midpoint * 12) / 100000;
  }

  return midpoint;
}

export function getMatchTone(score) {
  if (score >= 80) {
    return "good";
  }
  if (score >= 60) {
    return "amber";
  }
  if (score >= 40) {
    return "neutral";
  }
  return "subtle";
}
