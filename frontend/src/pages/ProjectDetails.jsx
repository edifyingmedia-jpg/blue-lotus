import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function ProjectDetails() {
  const { id } = useParams();
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div style={styles.wrapper} className="page-fade">

      {/* LEFT AI PANEL */}
      <div style={styles.aiPanel}>

        {/* SECTION NAVIGATION */}
        <div style={styles.navGroup}>
          <h2 style={styles.projectTitle}>Project {id}</h2>

          <button
            style={{
              ...styles.navButton,
              ...(activeSection === "overview" ? styles.navActive : {})
            }}
            onClick={() => setActiveSection("overview")}
          >
            Overview
          </button>

          <button
            style={{
              ...styles.navButton,
              ...(activeSection === "files" ? styles.navActive : {})
            }}
            onClick={() => setActiveSection("files")}
          >
            Files
          </button>

          <button
            style={{
              ...styles.navButton,
              ...(activeSection === "timeline" ? styles.navActive : {})
            }}
            onClick={() => setActiveSection("timeline")}
          >
            Timeline
          </button>

          <button
            style={{
              ...styles.navButton,
              ...(activeSection === "builder" ? styles.navActive : {})
            }}
            onClick={() => setActiveSection("builder")}
          >
            Builder
          </button>
        </div>

        {/* AI MESSAGE AREA (EMPTY, SCROLLABLE) */}
        <div style={styles.aiMessages}>
          {/* Intentionally empty — ready for future AI integration */}
        </div>

        {/* AI INPUT AREA */}
        <div style={styles.aiInputContainer}>
          <input
            style={styles.aiInput}
            placeholder="Ask Blue Lotus AI..."
          />
        </div>
      </div>

      {/* RIGHT WORKSPACE */}
      <div style={styles.workspace}>
        {activeSection === "overview" && (
          <div style={styles.sectionBlock}>
            <h1 style={styles.sectionHeading}>Overview</h1>
            <p style={styles.sectionText}>
              This is your cinematic project overview.  
              Future dynamic data will appear here.
            </p>
          </div>
        )}

        {activeSection === "files" && (
          <div style={styles.sectionBlock}>
            <h1 style={styles.sectionHeading}>Files</h1>
            <p style={styles.sectionText}>
              File management and previews will appear here.
            </p>
          </div>
        )}

        {activeSection === "timeline" && (
          <div style={styles.sectionBlock}>
            <h1 style={styles.sectionHeading}>Timeline</h1>
            <p style={styles.sectionText}>
              Project history and milestones will appear here.
            </p>
          </div>
        )}

        {activeSection === "builder" && (
          <div style={styles.sectionBlock}>
            <h1 style={styles.sectionHeading}>Builder</h1>
            <p style={styles.sectionText}>
              Your future Blue Lotus builder engine will live here.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

/* ---------------------------
   BLUE LOTUS × EMERGENT STYLES
---------------------------- */
const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#0a0f1f",
    color: "white",
    fontFamily: "Inter, sans-serif",
  },

  /* LEFT AI PANEL */
  aiPanel: {
    width: "340px",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid rgba(0,255,255,0.08)",
    backgroundColor: "#0d1326",
  },

  navGroup: {
    padding: "25px",
    borderBottom: "1px solid rgba(0,255,255,0.08)",
  },

  projectTitle: {
    fontSize: "22px",
    marginBottom: "20px",
    color: "#00eaff",
    textShadow: "0 0 8px rgba(0,255,255,0.4)",
  },

  navButton: {
    width: "100%",
    padding: "10px 12px",
    marginBottom: "10px",
    backgroundColor: "transparent",
    border: "1px solid rgba(0,255,255,0.15)",
    borderRadius: "6px",
    color: "#00eaff",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "14px",
  },

  navActive: {
    backgroundColor: "rgba(0,255,255,0.08)",
    borderColor: "rgba(0,255,255,0.4)",
  },

  aiMessages: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
  },

  /* AI INPUT */
  aiInputContainer: {
    padding: "20px",
    borderTop: "1px solid rgba(0,255,255,0.08)",
  },

  aiInput: {
    width: "100%",
    padding: "12px 14px",
    backgroundColor: "#11182f",
    border: "1px solid rgba(0,255,255,0.2)",
    borderRadius: "6px",
    color: "white",
    outline: "none",
  },

  /* WORKSPACE */
  workspace: {
    flex: 1,
    padding: "50px",
    overflowY: "auto",
  },

  sectionBlock: {
    maxWidth: "900px",
  },

  sectionHeading: {
    fontSize: "36px",
    marginBottom: "10px",
    color: "#00eaff",
    textShadow: "0 0 12px rgba(0,255,255,0.5)",
  },

  sectionText: {
    fontSize: "18px",
    opacity: 0.8,
  },
};
