import React from "react";

// Global keyframes for typing shimmer
const typingKeyframes = `
@keyframes typingPulse {
  0% { opacity: 0.25; }
  50% { opacity: 1; }
  100% { opacity: 0.25; }
}
`;

if (typeof document !== "undefined") {
  const styleTag = document.createElement("style");
  styleTag.innerHTML = typingKeyframes;
  document.head.appendChild(styleTag);
}

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
    width: "500px",
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
};

export default function ProjectDetails() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.title}>Project Details</div>
        <div style={styles.text}>
          This is a simple placeholder page for your project details.
          <br />
          <br />
          You can expand this later with:
          <br />• Project title  
          <br />• Description  
          <br />• Tasks  
          <br />• Notes  
          <br />• Files  
          <br />• And eventually the full cinematic workspace  
        </div>
      </div>
    </div>
  );
}
