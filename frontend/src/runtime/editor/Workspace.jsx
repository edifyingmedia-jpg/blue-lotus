// Workspace.jsx
"use client";

import React from "react";
import EditorScreen from "./EditorScreen";

export default function Workspace() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0d0d0d",
        color: "#fff",
        overflow: "hidden"
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          height: "48px",
          width: "100%",
          background: "#111",
          borderBottom: "1px solid #222",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          fontSize: "14px",
          letterSpacing: "0.5px"
        }}
      >
        Blue Lotus — Editor
      </div>

      {/* Main Editor Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          width: "100%",
          height: "100%"
        }}
      >
        {/* Left Sidebar (Tools) */}
        <div
          style={{
            width: "64px",
            background: "#141414",
            borderRight: "1px solid #222",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "12px",
            gap: "12px"
          }}
        >
          <div style={{ width: 32, height: 32, background: "#222", borderRadius: 6 }} />
          <div style={{ width: 32, height: 32, background: "#222", borderRadius: 6 }} />
          <div style={{ width: 32, height: 32, background: "#222", borderRadius: 6 }} />
        </div>

        {/* Canvas Area */}
        <div style={{ flex: 1, position: "relative" }}>
          <EditorScreen />
        </div>

        {/* Right Sidebar (Properties) */}
        <div
          style={{
            width: "280px",
            background: "#141414",
            borderLeft: "1px solid #222",
            padding: "16px"
          }}
        >
          <h3 style={{ margin: 0, marginBottom: 12, fontSize: 16 }}>Properties</h3>
          <div style={{ width: "100%", height: 200, background: "#222", borderRadius: 8 }} />
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          height: "32px",
          width: "100%",
          background: "#111",
          borderTop: "1px solid #222",
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          fontSize: "12px"
        }}
      >
        Zoom: 100%
      </div>
    </div>
  );
}
