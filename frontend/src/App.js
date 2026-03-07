import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import NewProject from "./pages/NewProject";
import Account from "./pages/Account";
import Logout from "./pages/Logout";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Main Pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/new-project" element={<NewProject />} />

        {/* Account Page */}
        <Route path="/account" element={<Account />} />

        {/* Settings Placeholder (build later) */}
        <Route path="/settings" element={<div>Settings Page Coming Soon</div>} />

        {/* Fully Functional Logout */}
        <Route path="/logout" element={<Logout />} />

        {/* Default Route */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
