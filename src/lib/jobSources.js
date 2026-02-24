export function getSourceApplyUrl(job) {
  const query = encodeURIComponent(`${job.title} ${job.company}`);
  const location = encodeURIComponent(job.location || "");

  if (job.source === "LinkedIn") {
    return `https://www.linkedin.com/jobs/search/?keywords=${query}&location=${location}`;
  }

  if (job.source === "Naukri") {
    return `https://www.naukri.com/${query}-jobs`;
  }

  if (job.source === "Indeed") {
    return `https://in.indeed.com/jobs?q=${query}&l=${location}`;
  }

  return job.applyUrl;
}
