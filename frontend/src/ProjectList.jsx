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
    padding: "40px",
    borderRadius: "10px",
    border: "1px solid rgba(0,255,255,0.15)",
    width: "600px",
    textAlign: "center",
    boxShadow: "0 0 20px rgba(0,255,255,0.15)",
  },

  title: {
    fontSize: "32px",
    marginBottom: "20px",
    color: "#00eaff",
    textShadow: "0 0 10px rgba(0,255,255,0.5)",
  },

  text: {
    fontSize: "18px",
    opacity: 0.85,
    lineHeight: "1.6",
  },

  list: {
    marginTop: "25px",
    textAlign: "left",
  },

  listItem: {
    padding: "10px 0",
    borderBottom: "1px solid rgba(0,255,255,0.1)",
    fontSize: "17px",
  },
};

export default function ProjectList() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.title}>Your Projects</div>

        <div style={styles.text}>
          This is a simple placeholder page for listing your projects.
          <br />
          <br />
          You can expand this later with:
          <br />• Project names  
          <br />• Links to details  
          <br />• Status indicators  
          <br />• Sorting and filtering  
        </div>

        <div style={styles.list}>
          <div style={styles.listItem}>Example Project 1</div>
          <div style={styles.listItem}>Example Project 2</div>
          <div style={styles.listItem}>Example Project 3</div>
        </div>
      </div>
    </div>
  );
}
// Ready for new page code
