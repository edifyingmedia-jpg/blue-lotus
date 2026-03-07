import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

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
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>Blue Lotus</h2>

        <nav style={styles.nav}>
          <Link to="/dashboard" style={styles.navItem}>Dashboard</Link>
          <Link to="/projects" style={styles.navItem}>My Projects</Link>
          <Link to="/new-project" style={styles.navItem}>Create New Project</Link>
          <Link to="/account" style={styles.navItem}>Account</Link>
          <Link to="/settings" style={styles.navItem}>Settings</Link>
          <Link to="/logout" style={styles.navItem}>Logout</Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main style={styles.main}>
        <h1 style={styles.heading}>Dashboard</h1>
        <p style={styles.subtext}>Welcome to your Blue Lotus dashboard.</p>

        {user && (
          <p style={styles.userEmail}>
            Logged in as: <strong>{user.email}</strong>
          </p>
        )}

        {/* DASHBOARD CARDS */}
        <div style={styles.cardGrid}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>My Projects</h3>
            <p style={styles.cardText}>View and manage your active builds.</p>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Create New Project</h3>
            <p style={styles.cardText}>Start something new and cinematic.</p>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Account</h3>
            <p style={styles.cardText}>Manage your profile and preferences.</p>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Settings</h3>
            <p style={styles.cardText}>Customize your Blue Lotus experience.</p>
          </div>
        </div>
      </main>
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
    backgroundColor: "#0a0f1f",
    color: "white",
    fontFamily: "Inter, sans-serif",
  },

  sidebar: {
    width: "260px",
    backgroundColor: "#0d1228",
    borderRight: "1px solid rgba(0, 255, 255, 0.2)",
    padding: "30px 20px",
    boxShadow: "0 0 20px rgba(0, 255, 255, 0.15)",
  },

  logo: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "40px",
    color: "#00eaff",
    textShadow: "0 0 10px rgba(0, 255, 255, 0.6)",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  navItem: {
    color: "#b8c6ff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.2s",
    padding: "8px 0",
    textDecoration: "none",
  },

  main: {
    flex: 1,
    padding: "50px",
  },

  heading: {
    fontSize: "36px",
    marginBottom: "10px",
    color: "#00eaff",
    textShadow: "0 0 12px rgba(0, 255, 255, 0.5)",
  },

  subtext: {
    fontSize: "18px",
    opacity: 0.8,
    marginBottom: "30px",
  },

  userEmail: {
    marginBottom: "40px",
    opacity: 0.9,
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "30px",
  },

  card: {
    backgroundColor: "#11182f",
    padding: "25px",
    borderRadius: "12px",
    border: "1px solid rgba(0, 255, 255, 0.15)",
    boxShadow: "0 0 15px rgba(0, 255, 255, 0.1)",
    transition: "0.25s",
  },

  cardTitle: {
    fontSize: "20px",
    marginBottom: "10px",
    color: "#00eaff",
  },

  cardText: {
    opacity: 0.8,
  },
};
