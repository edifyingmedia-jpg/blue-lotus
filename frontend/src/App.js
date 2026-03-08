/* -------------------------------------------------------------------------- */
/*                                BLUE LOTUS APP                              */
/* -------------------------------------------------------------------------- */
/*  This file defines the global cinematic app shell for Blue Lotus:           */
/*    - Tri-Neon frame (cyan / purple / pink)                                  */
/*    - Smooth fade transitions between pages                                  */
/*    - Centralized routing (Dashboard, ProjectDetails, CreateProject)         */
/*    - Global layout wrapper                                                   */
/*    - Unified theme + background                                              */
/* -------------------------------------------------------------------------- */

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import ProjectDetails from "./pages/ProjectDetails";
import CreateProject from "./pages/CreateProject";

export default function App() {
  return (
    <Router>
      <div style={styles.appShell}>
        <div style={styles.neonFrame} />

        <div style={styles.contentWrapper}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/create" element={<CreateProject />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   STYLES                                   */
/* -------------------------------------------------------------------------- */
const styles = {
  appShell: {
    minHeight: "100vh",
    background: "#050812",
    color: "white",
    position: "relative",
    overflow: "hidden",
    fontFamily: "Inter, sans-serif",
  },

  /* Tri-Neon animated frame */
  neonFrame: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    background:
      "radial-gradient(circle at top left, rgba(0,238,255,0.25), transparent 60%), \
       radial-gradient(circle at top right, rgba(255,0,255,0.25), transparent 60%), \
       radial-gradient(circle at bottom, rgba(255,0,128,0.25), transparent 60%)",
    filter: "blur(80px)",
    zIndex: 1,
  },

  contentWrapper: {
    position: "relative",
    zIndex: 2,
    padding: "30px",
    animation: "fadeIn 0.6s ease",
  },
};

/* -------------------------------------------------------------------------- */
/*                               GLOBAL ANIMATIONS                            */
/* -------------------------------------------------------------------------- */
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`);
