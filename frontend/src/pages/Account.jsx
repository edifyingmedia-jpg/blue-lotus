import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Account() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    }
    loadUser();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Account</h1>
      <p style={styles.subtext}>Your profile information.</p>

      {!user && <p style={styles.loading}>Loading...</p>}

      {user && (
        <div style={styles.card}>
          <h3 style={styles.label}>Email</h3>
          <p style={styles.value}>{user.email}</p>

          <h3 style={styles.label}>User ID</h3>
          <p style={styles.value}>{user.id}</p>
        </div>
      )}
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

  loading: {
    opacity: 0.7,
  },

  card: {
    backgroundColor: "#11182f",
    padding: "25px",
    borderRadius: "12px",
    border: "1px solid rgba(0,255,255,0.15)",
    boxShadow: "0 0 15px rgba(0,255,255,0.1)",
    maxWidth: "500px",
  },

  label: {
    fontSize: "16px",
    color: "#00eaff",
    marginTop: "15px",
    marginBottom: "5px",
  },

  value: {
    opacity: 0.85,
    fontSize: "15px",
  },
};
