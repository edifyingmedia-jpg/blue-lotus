import React from "react";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    loadUser();
  }, []);

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Blue Lotus</h2>

        <nav style={styles.nav}>
          <a style={styles.navItem}>Dashboard</a>
          <a style={styles.navItem}>My Projects</a>
          <a style={styles.navItem}>Create New Project</a>
          <a style={styles.navItem}>Account</a>
          <a style={styles.navItem}>Settings</a>
          <a style={styles.navItem}>Logout</a>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.main}>
        <h1 style={styles.heading}>Dashboard</h1>
        <p style={styles.subtext}>Welcome to your Blue Lotus dashboard.</p>

        {user && (
          <p style={styles.userEmail}>
            Logged in as: <strong>{user.email}</strong>
          </p>
        )}

        {/* Example Cinematic Cards */}
        <div style={styles.cardGrid}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>My Projects</h3>
            <p style={styles.cardText}>View and manage your active builds.</p>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Create New Project</h3>
            <p style={styles.cardText}>Start building something new.</p>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Account Settings</h3>
            <p style={styles.cardText}>Manage your profile and preferences.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------
   CINEMATIC TRI-NEON STYLES
---------------------------- */
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#0a0f14",
    color: "white",
    fontFamily: "Inter, sans-serif",
  },

  /* SIDEBAR */
  sidebar: {
    width: "260px",
    backgroundColor: "#0d141b",
    borderRight: "1px solid rgba(0,255,255,0.2)",
    padding: "30px 20px",
    boxShadow: "0 0 20px rgba(0,255,255,0.15)",
  },

  logo: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "40px",
    color: "#00eaff",
    textShadow: "0 0 10px rgba(0,255,255,0.6)",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  navItem: {
    fontSize: "16px",
    cursor: "pointer",
    padding: "8px 0",
    color: "#c8d4e0",
    transition: "0.2s",
    textDecoration: "none",
    borderLeft: "3px solid transparent",
  },

  navItemHover: {
    color: "#00eaff",
    borderLeft: "3px solid #00eaff",
  },

  /* MAIN CONTENT */
  main: {
    flex: 1,
    padding: "50px",
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

  userEmail: {
    marginBottom: "40px",
    fontSize: "16px",
    opacity: 0.9,
  },

  /* CARDS */
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "25px",
    marginTop: "20px",
  },

  card: {
    backgroundColor: "#111820",
    padding: "25px",
    borderRadius: "12px",
    border: "1px solid rgba(0,255,255,0.15)",
    boxShadow: "0 0 15px rgba(0,255,255,0.1)",
    transition: "0.25s",
  },

  cardTitle: {
    fontSize: "20px",
    marginBottom: "10px",
    color: "#00eaff",
  },

  cardText: {
    fontSize: "15px",
    opacity: 0.8,
  },
};
