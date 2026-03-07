import React from "react";

export default function Settings() {
  return (
    <div className="page-fade" style={styles.container}>
      <h1 style={styles.heading} className="neon-hover">
        Settings
      </h1>

      <p style={styles.subtext}>
        Customize your Blue Lotus experience.
      </p>

      <div className="neon-card" style={styles.card}>
        <h3 style={styles.sectionTitle}>Appearance</h3>
        <p style={styles.placeholder}>Theme options coming soon.</p>

        <h3 style={styles.sectionTitle}>Notifications</h3>
        <p style={styles.placeholder}>Notification controls coming soon.</p>

        <h3 style={styles.sectionTitle}>Builder Preferences</h3>
        <p style={styles.placeholder}>Advanced builder settings coming soon.</p>
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

  sectionTitle: {
    fontSize: "18px",
    color: "#00eaff",
    marginTop: "20px",
    marginBottom: "5px",
  },

  placeholder: {
    opacity: 0.75,
    fontSize: "15px",
    marginBottom: "10px",
  },
};
