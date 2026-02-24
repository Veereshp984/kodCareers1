import React, { useEffect, useMemo, useState } from "react";
import { jobs } from "../data/jobs";
import { calculateMatchScore, extractSalaryScore, getMatchTone } from "../lib/matching";
import { JOB_STATUS, JOB_STATUS_OPTIONS, addStatusUpdate, getJobStatus, getStatusMap, setJobStatus } from "../lib/jobStatus";
import { getSourceApplyUrl } from "../lib/jobSources";
import { getPreferences, hasSavedPreferences } from "../lib/preferences";
import { getSavedJobIds, toggleSavedJobId } from "../lib/savedJobs";
import "../styles/base.css";

export function DashboardPage() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("all");
  const [mode, setMode] = useState("all");
  const [experience, setExperience] = useState("all");
  const [source, setSource] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("latest");
  const [savedIds, setSavedIds] = useState(() => getSavedJobIds());
  const [statusMap, setStatusMap] = useState(() => getStatusMap());
  const [selectedJob, setSelectedJob] = useState(null);
  const [showOnlyMatches, setShowOnlyMatches] = useState(false);
  const [toastText, setToastText] = useState("");
  const preferences = useMemo(() => getPreferences(), []);
  const preferencesReady = useMemo(() => hasSavedPreferences(), []);

  const filterOptions = useMemo(() => {
    const getUnique = (key) => [...new Set(jobs.map((job) => job[key]))];
    return {
      locations: getUnique("location"),
      modes: getUnique("mode"),
      experiences: getUnique("experience"),
      sources: getUnique("source")
    };
  }, []);

  const jobsWithScore = useMemo(
    () =>
      jobs.map((job) => ({
        ...job,
        matchScore: calculateMatchScore(job, preferences),
        salarySortValue: extractSalaryScore(job.salaryRange)
      })),
    [preferences]
  );

  const filteredJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const next = jobsWithScore.filter((job) => {
      const queryMatch =
        normalizedQuery.length === 0 ||
        job.title.toLowerCase().includes(normalizedQuery) ||
        job.company.toLowerCase().includes(normalizedQuery);
      const locationMatch = location === "all" || job.location === location;
      const modeMatch = mode === "all" || job.mode === mode;
      const experienceMatch = experience === "all" || job.experience === experience;
      const sourceMatch = source === "all" || job.source === source;
      const thresholdMatch = !showOnlyMatches || job.matchScore >= preferences.minMatchScore;
      const currentStatus = getJobStatus(job.id, statusMap);
      const statusMatch = statusFilter === "all" || currentStatus === statusFilter;

      return queryMatch && locationMatch && modeMatch && experienceMatch && sourceMatch && thresholdMatch && statusMatch;
    });

    return [...next].sort((a, b) => {
      if (sort === "matchScore") {
        return b.matchScore - a.matchScore;
      }
      if (sort === "salary") {
        return b.salarySortValue - a.salarySortValue;
      }
      return a.postedDaysAgo - b.postedDaysAgo;
    });
  }, [experience, jobsWithScore, location, mode, preferences.minMatchScore, query, showOnlyMatches, sort, source, statusFilter, statusMap]);

  const onSave = (jobId) => {
    const nextIds = toggleSavedJobId(jobId);
    setSavedIds(nextIds);
  };

  const isSaved = (jobId) => savedIds.includes(jobId);
  const onStatusChange = (job, status) => {
    const current = getJobStatus(job.id, statusMap);
    if (current === status) {
      return;
    }

    const nextMap = setJobStatus(job.id, status);
    setStatusMap(nextMap);

    if (status !== JOB_STATUS.NOT_APPLIED) {
      addStatusUpdate({
        jobId: job.id,
        title: job.title,
        company: job.company,
        status,
        changedAt: new Date().toISOString()
      });
      setToastText(`Status updated: ${status}`);
    }
  };

  const renderPostedText = (days) => {
    if (days === 0) {
      return "Today";
    }
    return days === 1 ? "1 day ago" : `${days} days ago`;
  };

  useEffect(() => {
    if (!toastText) {
      return undefined;
    }

    const timer = window.setTimeout(() => setToastText(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toastText]);

  const getStatusTone = (status) => {
    if (status === JOB_STATUS.APPLIED) {
      return "applied";
    }
    if (status === JOB_STATUS.REJECTED) {
      return "rejected";
    }
    if (status === JOB_STATUS.SELECTED) {
      return "selected";
    }
    return "neutral";
  };

  return (
    <section className="page">
      <h1 className="page__heading">Job Dashboard</h1>
      <p className="page__subtext">Live openings curated for early-career tech talent in India.</p>
      {!preferencesReady ? (
        <div className="match-banner">Set your preferences to activate intelligent matching.</div>
      ) : null}

      <div className="filter-bar">
        <input
          className="field__input"
          type="search"
          placeholder="Search title or company"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search jobs by title or company"
        />
        <select className="field__input" value={location} onChange={(event) => setLocation(event.target.value)}>
          <option value="all">All Locations</option>
          {filterOptions.locations.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
        <select className="field__input" value={mode} onChange={(event) => setMode(event.target.value)}>
          <option value="all">All Modes</option>
          {filterOptions.modes.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
        <select className="field__input" value={experience} onChange={(event) => setExperience(event.target.value)}>
          <option value="all">All Experience</option>
          {filterOptions.experiences.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
        <select className="field__input" value={source} onChange={(event) => setSource(event.target.value)}>
          <option value="all">All Sources</option>
          {filterOptions.sources.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
        <select className="field__input" value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="latest">Latest</option>
          <option value="matchScore">Match Score</option>
          <option value="salary">Salary</option>
        </select>
        <select className="field__input" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="all">All Status</option>
          {JOB_STATUS_OPTIONS.map((status) => (
            <option value={status} key={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <label className="match-toggle">
        <input
          type="checkbox"
          checked={showOnlyMatches}
          onChange={(event) => setShowOnlyMatches(event.target.checked)}
        />
        <span>Show only jobs above my threshold</span>
      </label>

      {filteredJobs.length === 0 ? (
        <div className="saved-empty">
          <h2 className="saved-empty__title">No roles match your criteria. Adjust filters or lower threshold.</h2>
        </div>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <article className="job-card" key={job.id}>
              {(() => {
                const jobStatus = getJobStatus(job.id, statusMap);
                return (
                  <p className={`status-pill status-pill--${getStatusTone(jobStatus)}`}>{jobStatus}</p>
                );
              })()}
              <div className="job-card__top">
                <h2 className="job-card__title">{job.title}</h2>
                <span className={`match-badge match-badge--${getMatchTone(job.matchScore)}`}>
                  Match {job.matchScore}
                </span>
              </div>
              <p className="job-card__company">{job.company}</p>
              <p className="job-card__meta">{job.location} | {job.mode}</p>
              <p className="job-card__meta">Experience: {job.experience}</p>
              <p className="job-card__salary">{job.salaryRange}</p>
              <p className="job-card__meta">Source: <span className="job-card__badge">{job.source}</span></p>
              <p className="job-card__posted">{renderPostedText(job.postedDaysAgo)}</p>
              <div className="status-group" role="group" aria-label="Job status">
                {JOB_STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={`status-btn${getJobStatus(job.id, statusMap) === status ? " status-btn--active" : ""}`}
                    onClick={() => onStatusChange(job, status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <div className="job-card__actions">
                <button type="button" className="btn btn--secondary" onClick={() => setSelectedJob(job)}>
                  View
                </button>
                <button type="button" className="btn btn--secondary" onClick={() => onSave(job.id)}>
                  {isSaved(job.id) ? "Saved" : "Save"}
                </button>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => window.open(getSourceApplyUrl(job), "_blank", "noopener,noreferrer")}
                >
                  Apply
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedJob ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelectedJob(null)}>
          <div className="modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <h3 className="modal__title">{selectedJob.title}</h3>
            <p className="modal__company">{selectedJob.company}</p>
            <p className="modal__description">{selectedJob.description}</p>
            <div className="modal__skills">
              {selectedJob.skills.map((skill) => (
                <span key={skill} className="modal__skill">
                  {skill}
                </span>
              ))}
            </div>
            <div className="modal__footer">
              <button type="button" className="btn btn--secondary" onClick={() => setSelectedJob(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toastText ? <div className="status-toast">{toastText}</div> : null}
    </section>
  );
}

