export * from "./components/AppShell";
export * from "./components/Button";
export * from "./components/Card";
export * from "./components/InputField";
export * from "./components/StatusBadge";
export * from "./components/TopNav";
export * from "./components/ProgressIndicator";
export * from "./components/CopyBox";
export * from "./components/ChecklistFooter";
export * from "./components/EmptyState";
export * from "./components/ErrorState";
export * from "./AppRoutes";

import React from "react";
import ReactDOM from "react-dom/client";
import { AppRoutes } from "./AppRoutes";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);

