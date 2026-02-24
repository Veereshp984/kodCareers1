import React, { useEffect, useMemo, useState } from "react";
import { jobs } from "../data/jobs";
import { JOB_STATUS, JOB_STATUS_OPTIONS, addStatusUpdate, getJobStatus, getStatusMap, setJobStatus } from "../lib/jobStatus";
import { getSourceApplyUrl } from "../lib/jobSources";
import { getSavedJobIds, toggleSavedJobId } from "../lib/savedJobs";
import "../styles/base.css";

export function SavedPage() {
  const [savedIds, setSavedIds] = useState(() => getSavedJobIds());
  const [statusMap, setStatusMap] = useState(() => getStatusMap());
  const [selectedJob, setSelectedJob] = useState(null);
  const [toastText, setToastText] = useState("");

  const savedJobs = useMemo(() => {
    const ids = new Set(savedIds);
    return jobs.filter((job) => ids.has(job.id)).sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
  }, [savedIds]);

  const removeSaved = (jobId) => {
    const nextIds = toggleSavedJobId(jobId);
    setSavedIds(nextIds);
  };

  const renderPostedText = (days) => {
    if (days === 0) {
      return "Today";
    }
    return days === 1 ? "1 day ago" : `${days} days ago`;
  };

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

  useEffect(() => {
    if (!toastText) {
      return undefined;
    }

    const timer = window.setTimeout(() => setToastText(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toastText]);

  return (
    <section className="page">
      <h1 className="page__heading">Saved Jobs</h1>
      <p className="page__subtext">Your saved roles stay available even after reload.</p>

      {savedJobs.length === 0 ? (
        <div className="saved-empty">
          <h2 className="saved-empty__title">No saved jobs yet</h2>
          <p className="saved-empty__description">
            Save roles from the dashboard to build your shortlist for this week.
          </p>
        </div>
      ) : (
        <div className="jobs-grid">
          {savedJobs.map((job) => (
            <article className="job-card" key={job.id}>
              {(() => {
                const jobStatus = getJobStatus(job.id, statusMap);
                return <p className={`status-pill status-pill--${getStatusTone(jobStatus)}`}>{jobStatus}</p>;
              })()}
              <div className="job-card__top">
                <h2 className="job-card__title">{job.title}</h2>
                <span className="job-card__badge">{job.source}</span>
              </div>
              <p className="job-card__company">{job.company}</p>
              <p className="job-card__meta">{job.location} | {job.mode}</p>
              <p className="job-card__meta">Experience: {job.experience}</p>
              <p className="job-card__salary">{job.salaryRange}</p>
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
                <button type="button" className="btn btn--secondary" onClick={() => removeSaved(job.id)}>
                  Remove
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

