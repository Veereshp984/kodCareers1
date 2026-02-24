import React from "react";

export function ProgressIndicator({ step, total }) {
  return (
    <div className="text-small text-muted">
      Step {step} / {total}
    </div>
  );
}

