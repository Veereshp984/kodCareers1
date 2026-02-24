import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { TEST_ITEMS, areAllTestsPassed, getPassedCount, getTestStatusMap } from "../lib/testChecklist";
import "../styles/base.css";

export function ShipPage() {
  const statusMap = useMemo(() => getTestStatusMap(), []);
  const passedCount = useMemo(() => getPassedCount(statusMap), [statusMap]);
  const allPassed = useMemo(() => areAllTestsPassed(statusMap), [statusMap]);

  if (!allPassed) {
    return (
      <section className="page">
        <h1 className="page__heading">Ship</h1>
        <p className="page__subtext">Complete all tests before shipping.</p>
        <p className="page__subtext" style={{ marginTop: "12px" }}>
          Tests Passed: {passedCount} / {TEST_ITEMS.length}
        </p>
        <p className="page__subtext" style={{ marginTop: "12px" }}>
          <Link to="/jt/07-test">Open Test Checklist</Link>
        </p>
      </section>
    );
  }

  return (
    <section className="page">
      <h1 className="page__heading">Ship</h1>
      <p className="page__subtext">All tests are complete. Ready to ship.</p>
    </section>
  );
}
