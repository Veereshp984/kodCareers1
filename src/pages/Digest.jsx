import React, { useMemo, useState } from "react";
import { jobs } from "../data/jobs";
import { getStatusUpdates } from "../lib/jobStatus";
import { calculateMatchScore } from "../lib/matching";
import { getPreferences, hasSavedPreferences } from "../lib/preferences";
import "../styles/base.css";

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDigestStorageKey(dateKey) {
  return `jobTrackerDigest_${dateKey}`;
}

function formatDisplayDate(dateKey) {
  const date = new Date(`${dateKey}T09:00:00`);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function buildDigestText(dateKey, digestJobs) {
  const lines = [
    "Top 10 Jobs For You - 9AM Digest",
    `Date: ${formatDisplayDate(dateKey)}`,
    ""
  ];

  digestJobs.forEach((job, index) => {
    lines.push(
      `${index + 1}. ${job.title} - ${job.company}`,
      `   Location: ${job.location}`,
      `   Experience: ${job.experience}`,
      `   Match Score: ${job.matchScore}`,
      `   Apply: ${job.applyUrl}`,
      ""
    );
  });

  lines.push("This digest was generated based on your preferences.");
  return lines.join("\n");
}

export function DigestPage() {
  const preferencesReady = useMemo(() => hasSavedPreferences(), []);
  const preferences = useMemo(() => getPreferences(), []);
  const recentStatusUpdates = useMemo(() => getStatusUpdates().slice(0, 8), []);
  const todayKey = useMemo(() => getTodayKey(), []);
  const digestKey = useMemo(() => getDigestStorageKey(todayKey), [todayKey]);
  const [digestJobs, setDigestJobs] = useState(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const raw = window.localStorage.getItem(digestKey);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed.jobs) ? parsed.jobs : [];
    } catch (error) {
      return [];
    }
  });
  const [statusText, setStatusText] = useState("");

  const generateDigest = () => {
    if (!preferencesReady) {
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    try {
      const existing = window.localStorage.getItem(digestKey);
      if (existing) {
        const parsed = JSON.parse(existing);
        const existingJobs = Array.isArray(parsed.jobs) ? parsed.jobs : [];
        setDigestJobs(existingJobs);
        setStatusText("Loaded today's existing digest.");
        return;
      }
    } catch (error) {
      // ignore malformed existing payload and regenerate
    }

    const ranked = jobs
      .map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        experience: job.experience,
        applyUrl: job.applyUrl,
        postedDaysAgo: job.postedDaysAgo,
        matchScore: calculateMatchScore(job, preferences)
      }))
      .filter((job) => job.matchScore > 0)
      .sort((a, b) => {
        if (b.matchScore !== a.matchScore) {
          return b.matchScore - a.matchScore;
        }
        return a.postedDaysAgo - b.postedDaysAgo;
      })
      .slice(0, 10);

    const payload = {
      date: todayKey,
      jobs: ranked
    };

    window.localStorage.setItem(digestKey, JSON.stringify(payload));
    setDigestJobs(ranked);
    setStatusText("Generated today's digest.");
  };

  const digestText = useMemo(() => buildDigestText(todayKey, digestJobs), [digestJobs, todayKey]);

  const copyDigest = async () => {
    if (!digestJobs.length || typeof window === "undefined") {
      return;
    }

    try {
      await window.navigator.clipboard.writeText(digestText);
      setStatusText("Digest copied to clipboard.");
    } catch (error) {
      setStatusText("Clipboard copy failed in this browser context.");
    }
  };

  const createEmailDraft = () => {
    if (!digestJobs.length || typeof window === "undefined") {
      return;
    }

    const subject = encodeURIComponent("My 9AM Job Digest");
    const body = encodeURIComponent(digestText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <section className="page">
      <h1 className="page__heading">Digest</h1>
      <p className="page__subtext">Demo Mode: Daily 9AM trigger simulated manually.</p>

      {!preferencesReady ? (
        <div className="saved-empty">
          <h2 className="saved-empty__title">Set preferences to generate a personalized digest.</h2>
        </div>
      ) : (
        <>
          <div className="digest-actions">
            <button type="button" className="btn btn--primary" onClick={generateDigest}>
              Generate Today&apos;s 9AM Digest (Simulated)
            </button>
            <button type="button" className="btn btn--secondary" onClick={copyDigest} disabled={!digestJobs.length}>
              Copy Digest to Clipboard
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={createEmailDraft}
              disabled={!digestJobs.length}
            >
              Create Email Draft
            </button>
          </div>

          {statusText ? <p className="page__subtext digest-status">{statusText}</p> : null}

          {digestJobs.length === 0 ? (
            <div className="saved-empty">
              <h2 className="saved-empty__title">No matching roles today. Check again tomorrow.</h2>
            </div>
          ) : (
            <article className="digest-email">
              <header className="digest-email__header">
                <h2 className="digest-email__title">Top 10 Jobs For You - 9AM Digest</h2>
                <p className="digest-email__date">{formatDisplayDate(todayKey)}</p>
              </header>

              <div className="digest-email__list">
                {digestJobs.map((job) => (
                  <div key={job.id} className="digest-item">
                    <h3 className="digest-item__title">{job.title}</h3>
                    <p className="digest-item__meta">{job.company}</p>
                    <p className="digest-item__meta">{job.location}</p>
                    <p className="digest-item__meta">Experience: {job.experience}</p>
                    <p className="digest-item__meta">Match Score: {job.matchScore}</p>
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={() => window.open(job.applyUrl, "_blank", "noopener,noreferrer")}
                    >
                      Apply
                    </button>
                  </div>
                ))}
              </div>

              <footer className="digest-email__footer">
                This digest was generated based on your preferences.
              </footer>
            </article>
          )}
        </>
      )}

      <section className="status-updates">
        <h2 className="status-updates__title">Recent Status Updates</h2>
        {recentStatusUpdates.length === 0 ? (
          <p className="page__subtext">No recent status updates yet.</p>
        ) : (
          <div className="status-updates__list">
            {recentStatusUpdates.map((update, index) => (
              <div key={`${update.jobId}-${update.changedAt}-${index}`} className="status-updates__item">
                <p className="status-updates__name">
                  {update.title} - {update.company}
                </p>
                <p className="status-updates__meta">Status: {update.status}</p>
                <p className="status-updates__meta">
                  Date changed:{" "}
                  {update.changedAt
                    ? new Date(update.changedAt).toLocaleString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    : "Unknown"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

