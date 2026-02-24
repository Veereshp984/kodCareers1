import React, { useMemo, useState } from "react";
import {
  TEST_ITEMS,
  areAllTestsPassed,
  getPassedCount,
  getTestStatusMap,
  resetTestStatusMap,
  saveTestStatusMap
} from "../lib/testChecklist";
import "../styles/base.css";

export function TestChecklistPage() {
  const [statusMap, setStatusMap] = useState(() => getTestStatusMap());
  const passedCount = useMemo(() => getPassedCount(statusMap), [statusMap]);
  const allPassed = useMemo(() => areAllTestsPassed(statusMap), [statusMap]);

  const onToggle = (itemId) => {
    const next = { ...statusMap, [itemId]: !statusMap[itemId] };
    setStatusMap(next);
    saveTestStatusMap(next);
  };

  const onReset = () => {
    const reset = resetTestStatusMap();
    setStatusMap(reset);
  };

  return (
    <section className="page">
      <h1 className="page__heading">Built-In Test Checklist</h1>
      <p className="page__subtext">Tests Passed: {passedCount} / 10</p>
      {!allPassed ? (
        <p className="test-warning">Resolve all issues before shipping.</p>
      ) : null}

      <div className="test-list">
        {TEST_ITEMS.map((item) => (
          <label key={item.id} className="test-item">
            <input
              type="checkbox"
              checked={Boolean(statusMap[item.id])}
              onChange={() => onToggle(item.id)}
            />
            <span className="test-item__label">{item.label}</span>
            <span className="test-item__hint" title={item.howToTest} aria-label={`How to test: ${item.label}`}>
              How to test
            </span>
          </label>
        ))}
      </div>

      <button type="button" className="btn btn--secondary" onClick={onReset}>
        Reset Test Status
      </button>
    </section>
  );
}
