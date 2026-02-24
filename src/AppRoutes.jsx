import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./styles/base.css";
import { TopNav } from "./components/TopNav";
import { LandingPage } from "./pages/Landing";
import { DashboardPage } from "./pages/Dashboard";
import { SettingsPage } from "./pages/Settings";
import { SavedPage } from "./pages/Saved";
import { ProofPage } from "./pages/Proof";

function NotFoundPage() {
  return (
    <div className="page">
      <h1 className="page__heading">Page Not Found</h1>
      <p className="page__subtext">
        The page you are looking for does not exist.
      </p>
      <p className="page__subtext" style={{ marginTop: "16px" }}>
        <Link to="/">Return to dashboard</Link>
      </p>
    </div>
  );
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <TopNav />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/proof" element={<ProofPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

