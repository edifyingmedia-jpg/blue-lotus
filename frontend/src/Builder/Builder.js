// frontend/src/Builder/Builder.js

/**
 * Builder.js
 * ---------------------------------------------------------
 * Top-level composition for the Blue Lotus Builder.
 *
 * Responsibilities:
 *  - Wrap the entire builder in BuilderEngine (state + actions)
 *  - Load project data via ProjectLoader
 *  - Render the full Builder UI:
 *      - Sidebar (left)
 *      - Canvas (center)
 *      - PropertiesPanel (right)
 */

import React from "react";
import BuilderEngine from "./BuilderEngine";
import ProjectLoader from "./ProjectLoader";

import Sidebar from "./Sidebar";
import Canvas from "./Canvas";
import PropertiesPanel from "./PropertiesPanel";

export default function Builder({ project }) {
  return (
    <BuilderEngine>
      <ProjectLoader project={project}>
        <div
          style={{
            display: "flex",
            height: "100vh",
            width: "100vw",
            overflow: "hidden",
            background: "#f5f5f5"
          }}
        >
          <Sidebar />
          <Canvas />
          <PropertiesPanel />
        </div>
      </ProjectLoader>
    </BuilderEngine>
  );
}
