import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ProjectList from "./pages/ProjectList";
import ProjectDetails from "./pages/ProjectDetails";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Project List */}
        <Route path="/projects" element={<ProjectList />} />

        {/* Project Details */}
        <Route path="/projects/:id" element={<ProjectDetails />} />
      </Routes>
    </Router>
  );
}

