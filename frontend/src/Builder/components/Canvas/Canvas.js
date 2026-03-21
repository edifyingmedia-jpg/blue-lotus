// frontend/src/Builder/components/Canvas/Canvas.js

/**
 * Canvas
 * ---------------------------------------------------------
 * The main visual workspace of the Builder.
 * Renders the active screen and its components.
 */

import React from "react";

export function Canvas({ builderState }) {
  const activeScreen = builderState?.screens?.[0] || null;

  return (
    <div className="canvas-root">
      {activeScreen ? (
        <div className="canvas-screen">
          {/* Future: Render components for the active screen */}
          <div className="canvas-placeholder">
            Screen: {activeScreen.name}
          </div>
        </div>
      ) : (
        <div className="canvas-empty">
          No screens yet — create one to begin.
        </div>
      )}
    </div>
  );
}
