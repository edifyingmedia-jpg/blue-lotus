// frontend/src/runtime/screens/SceneManager.js

/**
 * SceneManager.js
 * ---------------------------------------------------------
 * Stable container for rendering the active screen.
 *
 * Responsibilities:
 *  - Render the active screen via ScreenRenderer
 *  - Provide a root-level scene container
 *  - Prepare for future transitions or stacked navigation
 */

import React from "react";
import ScreenRenderer from "./ScreenRenderer";
import { useScreenEngine } from "../resolver/ScreenEngine";

export default function SceneManager() {
  const { activeScreen } = useScreenEngine();

  if (!activeScreen) {
    return (
      <div
        style={{
          padding: 20,
          color: "red",
          fontSize: 16,
          fontWeight: "bold",
        }}
      >
        No active screen loaded in SceneManager.
      </div>
    );
  }

  return (
    <div
      className="bl-scene-manager"
      data-scene={activeScreen?.name}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Future: transitions, animations, stacked navigation */}
      <ScreenRenderer />
    </div>
  );
}
