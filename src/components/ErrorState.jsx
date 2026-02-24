import React from "react";

export function ErrorState({
  title = "Something didn\u2019t work as expected.",
  description,
  resolution,
  technical
}) {
  return (
    <div className="error-state">
      <h2 className="error-state__title">{title}</h2>
      {description && (
        <p className="error-state__description text-muted">{description}</p>
      )}
      {resolution && (
        <p className="error-state__description">
          How to move forward: {resolution}
        </p>
      )}
      {technical && (
        <p className="error-state__technical">
          Technical details (for support): {technical}
        </p>
      )}
    </div>
  );
}

