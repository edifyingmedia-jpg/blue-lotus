import React from "react";

const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#0a0f1f",
    color: "white",
    fontFamily: "Inter, sans-serif",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: "50px",
    borderRadius: "12px",
    border: "1px solid rgba(0,255,255,0.15)",
    width: "650px",
    textAlign: "center",
    boxShadow: "0 0 25px rgba(0,255,255,0.18)",
  },

  title: {
    fontSize: "40px",
    marginBottom: "20px",
    color: "#00eaff",
    textShadow: "0 0 12px rgba(0,255,255,0.5)",
  },

  subtitle: {
    fontSize: "20px",
    opacity: 0.85,
    marginBottom: "30px",
    lineHeight: "1.6",
  },

  button: {
    padding: "14px 22px",
    backgroundColor: "rgba(0,255,255,0.12)",
    border: "1px solid rgba(0,255,255,0.3)",
    borderRadius: "8px",
    color: "#00eaff",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default function Home() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.title}>Welcome to Blue Lotus</div>
        <div style={styles.subtitle}>
          Your creative command center. A calm, cinematic space where your
          projects, ideas, and future tools will live.
        </div>

        <button style={styles.button}>View Projects</button>
      </div>
    </div>
  );
}
