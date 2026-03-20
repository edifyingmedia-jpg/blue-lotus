// frontend/src/runtime/engine/RuntimeEngine.js

/**
 * RuntimeEngine.js
 * ---------------------------------------------------------
 * The top-level orchestrator for the Blue Lotus runtime.
 *
 * Responsibilities:
 *  - Load project state
 *  - Load project screens
 *  - Provide full runtime environment
 *  - Render the active screen
 */

import React from "react";
import StateLoader from "../state/StateLoader";
import ScreenLoader from "../resolver/ScreenLoader";

export default function RuntimeEngine({ project }) {
  if (!project) {
    return (
      <div
        style={{
          padding: 20,
          color: "red",
          fontSize: 16,
          fontWeight: "bold",
        }}
      >
        No project provided to RuntimeEngine.
      </div>
    );
  }

  return (
    <StateLoader project={project}>
      <ScreenLoader project={project}>
        {/* The active screen will render inside ScreenEngine */}
      </ScreenLoader>
    </StateLoader>
  );
}
