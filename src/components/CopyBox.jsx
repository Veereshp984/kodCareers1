import React from "react";
import { Button } from "./Button";

export function CopyBox({ label, value, onCopy }) {
  const handleCopy = () => {
    if (navigator && navigator.clipboard && value) {
      navigator.clipboard.writeText(value).catch(() => {
        // Silently ignore clipboard failures; caller can still handle via onCopy.
      });
    }
    if (onCopy) {
      onCopy();
    }
  };

  return (
    <div className="copy-box">
      {label && <div className="text-small text-muted">{label}</div>}
      <div className="copy-box__content">{value}</div>
      <div>
        <Button variant="secondary" type="button" onClick={handleCopy}>
          Copy
        </Button>
      </div>
    </div>
  );
}

