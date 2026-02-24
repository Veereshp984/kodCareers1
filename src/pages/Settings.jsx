import React from "react";
import "../styles/base.css";

export function SettingsPage() {
  return (
    <section className="page">
      <h1 className="page__heading">Settings</h1>
      <p className="page__subtext">This section will be built in the next step.</p>
      <div style={{ marginTop: "24px" }}>
        <div className="field" style={{ marginBottom: "24px" }}>
          <label className="field__label" htmlFor="role-keywords">
            Role keywords
          </label>
          <input
            id="role-keywords"
            className="field__input"
            type="text"
            placeholder="e.g., Frontend Engineer, React, TypeScript"
          />
        </div>

        <div className="field" style={{ marginBottom: "24px" }}>
          <label className="field__label" htmlFor="preferred-locations">
            Preferred locations
          </label>
          <input
            id="preferred-locations"
            className="field__input"
            type="text"
            placeholder="e.g., Bengaluru, Hyderabad, Remote"
          />
        </div>

        <div className="field" style={{ marginBottom: "24px" }}>
          <label className="field__label" htmlFor="mode">
            Mode
          </label>
          <select id="mode" className="field__input" defaultValue="">
            <option value="" disabled>
              Select mode
            </option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">Onsite</option>
          </select>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="experience-level">
            Experience level
          </label>
          <select
            id="experience-level"
            className="field__input"
            defaultValue=""
          >
            <option value="" disabled>
              Select level
            </option>
            <option value="intern">Intern</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
          </select>
        </div>
      </div>
    </section>
  );
}

