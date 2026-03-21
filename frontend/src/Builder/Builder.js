// frontend/src/Builder/Builder.js

/**
 * Builder.js
 * ---------------------------------------------------------
 * The main UI shell for the Blue Lotus Builder.
 * Assembles the layout: Sidebar, Canvas, PropertiesPanel,
 * and wraps everything in BuilderContext.
 */

import React from "react";
import { BuilderProvider } from "./BuilderContext";
import Sidebar from "./Sidebar";
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";
import PropertiesPanel from "./PropertiesPanel";

export default function Builder() {
  return (
    <BuilderProvider>
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "#f5f7fa",
        }}
      >
        {/* Top toolbar */}
        <Toolbar />

        {/* Main layout */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            overflow: "hidden",
          }}
        >
          {/* Left sidebar */}
          <Sidebar />

          {/* Center canvas */}
          <div style={{ flex: 1, overflow: "auto" }}>
            <Canvas />
          </div>

          {/* Right properties panel */}
          <PropertiesPanel />
        </div>
      </div>
    </BuilderProvider>
  );
}
