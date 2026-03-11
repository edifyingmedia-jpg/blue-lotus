// BuilderSkeleton.jsx
// Unified Tri-Neon Builder Layout with TWIN placeholder
// Clean, stable, self-contained

import React from "react";
import NavBar from "./NavBar";

const BuilderSkeleton = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "rgba(5, 5, 15, 1)",
        color: "white",
        overflow: "hidden",
      }}
    >
      {/* Top Navigation */}
      <NavBar />

      {/* Main Builder Layout */}
      <div
        style={{
          display: "flex",
          flex: 1,
          width: "100%",
          height: "100%",
        }}
      >
        {/* Left Panel */}
        <div
          style={{
            width: "240px",
            background: "rgba(20, 20, 40, 0.9)",
            borderRight: "1px solid rgba(120, 120, 255, 0.25)",
            backdropFilter: "blur(10px)",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <div style={sectionTitle}>Navigation</div>
          <div style={navItem}>Screens</div>
          <div style={navItem}>Components</div>
          <div style={navItem}>Assets</div>
          <div style={navItem}>Data</div>
        </div>

        {/* Center Canvas */}
        <div
          style={{
            flex: 1,
            background: "rgba(10, 10, 25, 0.8)",
            borderRight: "1px solid rgba(120, 120, 255, 0.25)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.6)",
            fontSize: "18px",
          }}
        >
          Canvas Area (Your App Preview Will Render Here)
        </div>

        {/* Right Panel — TWIN Placeholder */}
        <div
          style={{
            width: "320px",
            background: "rgba(20, 0, 40, 0.85)",
            borderLeft: "1px solid rgba(255, 0, 150, 0.3)",
            backdropFilter: "blur(10px)",
            padding: "20px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={sectionTitle}>TWIN Assistant</div>

          <div
            style={{
              flex: 1,
              background: "rgba(255, 0, 150, 0.05)",
              border: "1px solid rgba(255, 0, 150, 0.3)",
              borderRadius: "8px",
              padding: "12px",
              overflowY: "auto",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            TWIN output will appear here.
          </div>

          <textarea
            placeholder="Ask TWIN to generate screens, components, flows..."
            style={{
              width: "100%",
              height: "80px",
              borderRadius: "8px",
              border: "1px solid rgba(255, 0, 150, 0.3)",
              background: "rgba(255, 0, 150, 0.05)",
              color: "white",
              padding: "10px",
              resize: "none",
            }}
          />

          <button
            style={{
              padding: "10px",
              borderRadius: "8px",
              background:
                "linear-gradient(90deg, rgba(255,0,150,0.8), rgba(120,0,255,0.8))",
              border: "none",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 0 12px rgba(255,0,150,0.4)",
            }}
          >
            Send to TWIN
          </button>
        </div>
      </div>
    </div>
  );
};

const sectionTitle = {
  fontSize: "16px",
  fontWeight: "600",
  marginBottom: "12px",
  color: "cyan",
  textShadow: "0 0 6px rgba(0,255,255,0.5)",
};

const navItem = {
  padding: "8px 0",
  fontSize: "14px",
  cursor: "pointer",
  color: "rgba(255,255,255,0.8)",
};

export default BuilderSkeleton;
