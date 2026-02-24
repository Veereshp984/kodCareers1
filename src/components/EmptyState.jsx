import React from "react";
import { Button } from "./Button";

export function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <h2 className="empty-state__title">{title}</h2>
      {description && (
        <p className="empty-state__description text-muted">{description}</p>
      )}
      {actionLabel && onAction && (
        <div>
          <Button type="button" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

