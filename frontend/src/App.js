import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import NewProject from "./pages/NewProject";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/new-project" element={<NewProject />} />

        {/* Optional placeholders for future pages */}
        <Route path="/account" element={<div>Account Page Coming Soon</div>} />
        <Route path="/settings" element={<div>Settings Page Coming Soon</div>} />
        <Route path="/logout" element={<div>Logout Coming Soon</div>} />

        {/* Default route */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
