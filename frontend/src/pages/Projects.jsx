import React from "react";

export default function Projects() {
  return (
    <div className="page-fade" style={styles.container}>
      <h1 style={styles.heading} className="neon-hover">
        Projects
      </h1>

      <p style={styles.subtext}>
        Manage your active and archived Blue Lotus projects.
      </p>

      <div className="neon-card" style={styles.card}>
        <h3 style={styles.cardTitle}>Your Project List</h3>
        <p style={styles.cardText}>
          Project listings and management tools will appear here.
        </p>
      </div>
    </div>
  );
}

/* ---------------------------
   CINEMATIC TRI-NEON STYLES
---------------------------- */
const styles = {
  container: {
    padding: "50px",
    color: "white",
    backgroundColor: "#0a0f1f",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
  },

  heading: {
    fontSize: "36px",
    marginBottom: "10px",
    color: "#00eaff",
    textShadow: "0 0 12px rgba(0,255,255,0.5)",
  },

  subtext: {
    fontSize: "18px",
    opacity: 0.8,
    marginBottom: "30px",
  },

  card: {
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
