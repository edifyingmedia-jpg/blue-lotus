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

  /* AI MESSAGE BLOCK (Emergent × Blue Lotus hybrid) */
  aiMessage: {
    backgroundColor: "rgba(255,255,255,0.03)", // subtle Emergent-style shade
    padding: "10px 14px",
    marginBottom: "12px",
    borderRadius: "6px", // NOT a bubble — just a soft panel
    border: "1px solid rgba(0,255,255,0.06)", // Blue Lotus neon clarity
    marginLeft: "6px", // slight indent (Option B)
    maxWidth: "92%", // keeps messages elegant and readable
    lineHeight: "1.5",
  },
    userMessage: {
    backgroundColor: "rgba(0,255,255,0.06)", // slightly brighter than AI messages
    padding: "10px 14px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid rgba(0,255,255,0.18)", // stronger Blue Lotus neon edge
    marginLeft: "18px", // deeper indent to distinguish user vs AI
    maxWidth: "92%",
    lineHeight: "1.5",
    color: "#b8faff", // softer cyan tone for user text
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
