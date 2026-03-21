// frontend/src/Builder/components/Canvas/Canvas.js

/**
 * Canvas
 * ---------------------------------------------------------
 * Renders the currently active screen.
 */

import React from "react";
import "./Canvas.css";

export function Canvas({ builderState }) {
  const { screens = [], activeScreenIndex = 0 } = builderState || {};
  const activeScreen = screens[activeScreenIndex];

  if (!activeScreen) {
    return (
      <div className="canvas-empty">
        No screen selected.
      </div>
    );
  }

  return (
    <div className="canvas">
      <h2 className="canvas-title">{activeScreen.name}</h2>

      <div className="canvas-content">
        {/* Future: render components for this screen */}
        <div className="canvas-placeholder">
          This is where components for <strong>{activeScreen.name}</strong> will appear.
        </div>
      </div>
    </div>
  );
}
