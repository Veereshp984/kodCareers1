import React from "react";

export function ChecklistFooter() {
  const items = ["UI Built", "Logic Working", "Test Passed", "Deployed"];

  return (
    <div className="checklist">
      {items.map((label) => (
        <div key={label} className="checklist__item">
          <span className="checklist__box" aria-hidden="true" />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

