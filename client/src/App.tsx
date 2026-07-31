import { Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "./components/app-shell";
import { LandingPage } from "./pages/landing-page";
import { DropResumePage } from "./pages/drop-resume-page";
import { EmployersPage } from "./pages/employers-page";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<LandingPage />} />
        <Route path="drop-resume" element={<DropResumePage />} />
        <Route path="employers" element={<EmployersPage />} />
        {/* Fallback & Redirects */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}


