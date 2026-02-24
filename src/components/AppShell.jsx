import React from "react";
import "../styles/base.css";
import { StatusBadge } from "./StatusBadge";
import { ProgressIndicator } from "./ProgressIndicator";
import { ChecklistFooter } from "./ChecklistFooter";
import { CopyBox } from "./CopyBox";

export function AppShell({
  appName = "Job Notification App",
  step,
  totalSteps,
  status = "Not Started",
  heading,
  subheading,
  primary,
  secondary,
  secondaryTitle = "Step guidance",
  secondaryDescription,
  secondaryPromptLabel = "Prompt",
  secondaryPromptValue = "",
  secondaryActions
}) {
  return (
    <div className="layout-shell app-root">
      <header className="layout-shell__topbar">
        <div className="layout-shell__topbar-left">
          <div className="layout-shell__app-name">{appName}</div>
        </div>
        <div className="layout-shell__topbar-center">
          {typeof step === "number" && typeof totalSteps === "number" && (
            <ProgressIndicator step={step} total={totalSteps} />
          )}
        </div>
        <div className="layout-shell__topbar-right">
          <StatusBadge status={status} />
        </div>
      </header>

      <section className="layout-shell__context">
        {heading && <h1 className="layout-shell__headline">{heading}</h1>}
        {subheading && (
          <p className="layout-shell__subtitle">{subheading}</p>
        )}
      </section>

      <main className="layout-shell__main">
        <section className="layout-shell__primary">{primary}</section>
        <aside className="layout-shell__secondary">
          <div className="card" style={{ marginBottom: "16px" }}>
            <h2
              style={{
                margin: 0,
                marginBottom: "8px",
                fontFamily: "var(--font-heading)",
                fontSize: "20px",
                lineHeight: "var(--line-height-heading)"
              }}
            >
              {secondaryTitle}
            </h2>
            {secondaryDescription && (
              <p
                style={{
                  margin: 0,
                  marginBottom: "16px",
                  fontSize: "14px",
                  color: "rgba(17,17,17,0.75)"
                }}
              >
                {secondaryDescription}
              </p>
            )}
            <CopyBox
              label={secondaryPromptLabel}
              value={secondaryPromptValue}
            />
            {secondaryActions && (
              <div style={{ marginTop: "16px" }}>{secondaryActions}</div>
            )}
          </div>
        </aside>
      </main>

      <footer className="layout-shell__footer">
        <ChecklistFooter />
      </footer>
    </div>
  );
}

