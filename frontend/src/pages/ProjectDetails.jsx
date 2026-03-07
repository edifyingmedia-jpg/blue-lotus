import React from "react";
import { useParams } from "react-router-dom";

export default function ProjectDetail() {
  const { id } = useParams();

  return (
    <div style={styles.wrapper} className="page-fade">

      {/* LEFT SIDEBAR */}
      <div style={styles.sidebar}>
        <h2 style={styles.projectTitle} className="neon-hover">
          Project {id}
        </h2>

        <div style={styles.sectionGroup}>
          <p style={styles.sectionLabel}>Navigation</p>

          <button style={styles.navButton}>Overview</button>
          <button style={styles.navButton}>Files</button>
          <button style={styles.navButton}>Timeline</button>
          <button style={styles.navButton}>Builder</button>
        </div>

        <div style={styles.sectionGroup}>
          <p style={styles.sectionLabel}>Actions</p>

          <button style={styles.actionButton}>Rename Project</button>
          <button style={styles.actionButton}>Duplicate</button>
          <button style={styles.actionButton}>Archive</button>
        </div>
      </div>

      {/* MAIN WORKSPACE */}
      <div style={styles.workspace}>
        <h1 style={styles.workspaceHeading} className="neon-hover">
          Workspace
        </h1>

        <p style={styles.workspaceSubtext}>
          This is your cinematic, full‑width project canvas.  
          Future builder tools, previews, and editors will appear here.
        </p>

        <div style={styles.workspaceCard} className="neon-card">
          <h3 style={styles.cardTitle}>Project Overview</h3>
          <p style={styles.cardText}>
            This section will display dynamic project data once Supabase is connected.
          </p>
        </div>
      </div>

    </div>
  );
}

/* ---------------------------
   CINEMATIC TWO-PANEL STYLES
---------------------------- */
const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#0a0f1f",
    color: "white",
    fontFamily: "Inter, sans-serif",
  },

  /* LEFT SIDEBAR */
  sidebar: {
    width: "260px",
    backgroundColor: "#0d1326",
    padding: "30px",
    borderRight: "1px solid rgba(0,255,255,0.1)",
  },

  projectTitle: {
    fontSize: "26px",
    marginBottom: "25px",
    color: "#00eaff",
    textShadow: "0 0 12px rgba(0,255,255,0.5)",
  },

  sectionGroup: {
    marginBottom: "40px",
  },

  sectionLabel: {
    fontSize: "14px",
    opacity: 0.6,
    marginBottom: "10px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  navButton: {
    width: "100%",
    padding: "10px 12px",
    marginBottom: "10px",
    backgroundColor: "#11182f",
    border: "none",
    borderRadius: "6px",
    color: "#00eaff",
    cursor: "pointer",
    textAlign: "left",
  },

  actionButton: {
    width: "100%",
    padding: "10px 12px",
    marginBottom: "10px",
    backgroundColor: "#1a2342",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
    textAlign: "left",
  },

  /* MAIN WORKSPACE */
  workspace: {
    flex: 1,
    padding: "50px",
  },

  workspaceHeading: {
    fontSize: "36px",
    marginBottom: "10px",
    color: "#00eaff",
    textShadow: "0 0 12px rgba(0,255,255,0.5)",
  },

  workspaceSubtext: {
    fontSize: "18px",
    opacity: 0.8,
    marginBottom: "30px",
  },

  workspaceCard: {
    backgroundColor: "#11182f",
    padding: "25px",
    borderRadius: "12px",
    marginTop: "20px",
  },

  cardTitle: {
    fontSize: "20px",
    color: "#00eaff",
    marginBottom: "8px",
  },

  cardText: {
    opacity: 0.8,
  },
};
