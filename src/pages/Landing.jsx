import React from "react";
import { Link } from "react-router-dom";
import "../styles/base.css";

export function LandingPage() {
  return (
    <section className="page">
      <div style={{ marginTop: "64px" }}>
        <header style={{ marginBottom: "40px" }}>
          <h1 className="page__heading">Stop Missing The Right Jobs.</h1>
          <p className="page__subtext">
            Precision-matched job discovery delivered daily at 9AM.
          </p>
        </header>
        <Link to="/settings" className="btn btn--primary" style={{ textDecoration: "none" }}>
          Start Tracking
        </Link>
      </div>
    </section>
  );
}

