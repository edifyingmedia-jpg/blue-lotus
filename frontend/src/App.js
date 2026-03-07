import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import NewProject from "./pages/NewProject";
import Account from "./pages/Account";
import Settings from "./pages/Settings";
import Logout from "./pages/Logout";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Main Pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/new-project" element={<NewProject />} />

        {/* Account + Settings */}
        <Route path="/account" element={<Account />} />
        <Route path="/settings" element={<Settings />} />

        {/* Logout */}
        <Route path="/logout" element={<Logout />} />

        {/* Default */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
