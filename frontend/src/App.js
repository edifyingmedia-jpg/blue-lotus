import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import ProjectList from "./pages/ProjectList";
import ProjectDetails from "./pages/ProjectDetails";

export default function App() {
  return (
    <Router>
      <nav style={{ display: 'flex', gap: '20px', padding: '20px', backgroundColor: 'rgba(0,255,255,0.05)', borderBottom: '1px solid rgba(0,255,255,0.2)' }}>
        <Link to="/" style={{ color: '#00eaff', textDecoration: 'none' }}>Home</Link>
        <Link to="/projects" style={{ color: '#00eaff', textDecoration: 'none' }}>Projects</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
      </Routes>
    </Router>
  );
}
