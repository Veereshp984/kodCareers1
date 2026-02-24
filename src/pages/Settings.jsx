import React, { useMemo, useState } from "react";
import { jobs } from "../data/jobs";
import {
  DEFAULT_PREFERENCES,
  getPreferences,
  parseCommaSeparated,
  savePreferences
} from "../lib/preferences";
import "../styles/base.css";

export function SettingsPage() {
  const storedPreferences = useMemo(() => getPreferences(), []);
  const [roleKeywordsText, setRoleKeywordsText] = useState(storedPreferences.roleKeywords.join(", "));
  const [preferredLocations, setPreferredLocations] = useState(storedPreferences.preferredLocations);
  const [preferredMode, setPreferredMode] = useState(storedPreferences.preferredMode);
  const [experienceLevel, setExperienceLevel] = useState(storedPreferences.experienceLevel);
  const [skillsText, setSkillsText] = useState(storedPreferences.skills.join(", "));
  const [minMatchScore, setMinMatchScore] = useState(storedPreferences.minMatchScore ?? 40);
  const [savedMessage, setSavedMessage] = useState("");

  const locationOptions = useMemo(
    () => [...new Set(jobs.map((job) => job.location))].sort((a, b) => a.localeCompare(b)),
    []
  );

  const experienceOptions = useMemo(
    () => [...new Set(jobs.map((job) => job.experience))],
    []
  );

  const handleLocationChange = (event) => {
    const nextValues = Array.from(event.target.selectedOptions, (option) => option.value);
    setPreferredLocations(nextValues);
  };

  const handleModeChange = (modeValue) => {
    setPreferredMode((prev) =>
      prev.includes(modeValue) ? prev.filter((item) => item !== modeValue) : [...prev, modeValue]
    );
  };

  const onSavePreferences = (event) => {
    event.preventDefault();

    const payload = {
      roleKeywords: parseCommaSeparated(roleKeywordsText),
      preferredLocations,
      preferredMode,
      experienceLevel,
      skills: parseCommaSeparated(skillsText),
      minMatchScore: Number(minMatchScore)
    };

    savePreferences(payload);
    setSavedMessage("Preferences saved.");
  };

  const onReset = () => {
    setRoleKeywordsText("");
    setPreferredLocations([]);
    setPreferredMode([]);
    setExperienceLevel("");
    setSkillsText("");
    setMinMatchScore(DEFAULT_PREFERENCES.minMatchScore);
    setSavedMessage("");
  };

  return (
    <section className="page">
      <h1 className="page__heading">Settings</h1>
      <p className="page__subtext">Set job preferences to activate intelligent matching on dashboard.</p>
      <form className="settings-form" onSubmit={onSavePreferences}>
        <div className="field">
          <label className="field__label" htmlFor="role-keywords">
            Role keywords
          </label>
          <input
            id="role-keywords"
            className="field__input"
            value={roleKeywordsText}
            onChange={(event) => setRoleKeywordsText(event.target.value)}
            type="text"
            placeholder="e.g., Backend, React Developer, Intern"
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="preferred-locations">
            Preferred locations
          </label>
          <select
            id="preferred-locations"
            className="field__input field__input--multi"
            multiple
            value={preferredLocations}
            onChange={handleLocationChange}
          >
            {locationOptions.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
          <p className="field__hint">Use Ctrl/Cmd + click to select multiple locations.</p>
        </div>

        <div className="field">
          <span className="field__label">Preferred mode</span>
          <div className="checkbox-group">
            {["Remote", "Hybrid", "Onsite"].map((modeOption) => (
              <label key={modeOption} className="checkbox-group__item">
                <input
                  type="checkbox"
                  checked={preferredMode.includes(modeOption)}
                  onChange={() => handleModeChange(modeOption)}
                />
                <span>{modeOption}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="experience-level">
            Experience level
          </label>
          <select
            id="experience-level"
            className="field__input"
            value={experienceLevel}
            onChange={(event) => setExperienceLevel(event.target.value)}
          >
            <option value="">Any</option>
            {experienceOptions.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="skills">
            Skills
          </label>
          <input
            id="skills"
            className="field__input"
            value={skillsText}
            onChange={(event) => setSkillsText(event.target.value)}
            type="text"
            placeholder="e.g., React, SQL, Spring Boot"
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="min-match-score">
            Minimum match score: <strong>{minMatchScore}</strong>
          </label>
          <input
            id="min-match-score"
            className="slider"
            type="range"
            min="0"
            max="100"
            value={minMatchScore}
            onChange={(event) => setMinMatchScore(Number(event.target.value))}
          />
        </div>

        <div className="settings-form__actions">
          <button type="submit" className="btn btn--primary">
            Save Preferences
          </button>
          <button type="button" className="btn btn--secondary" onClick={onReset}>
            Reset Form
          </button>
          {savedMessage ? <span className="settings-form__saved">{savedMessage}</span> : null}
        </div>
      </form>
    </section>
  );
}

