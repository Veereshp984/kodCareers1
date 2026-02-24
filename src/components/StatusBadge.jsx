import React from "react";

const STATUS_CLASS = {
  "Not Started": "badge badge--status-not-started",
  "In Progress": "badge badge--status-in-progress",
  Shipped: "badge badge--status-shipped"
};

export function StatusBadge({ status }) {
  const className = STATUS_CLASS[status] || "badge badge--status-not-started";
  return <span className={className}>{status}</span>;
}

