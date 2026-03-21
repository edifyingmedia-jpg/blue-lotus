// frontend/src/Builder/components/ScreenList/ScreenList.js

/**
 * ScreenList
 * ---------------------------------------------------------
 * Displays all screens in the project and allows selecting
 * the active screen.
 */

import React from "react";

export function ScreenList({ builderState, onSelectScreen }) {
  const screens = builderState?.screens || [];

  return (
    <div className="screen-list">
      <div className="screen-list-header">
        Screens
      </div>

      {screens.length === 0 && (
        <div className="screen-list-empty">
          No screens yet.
        </div>
      )}

      {screens.map((screen, index) => (
        <div
          key={screen.id || index}
          className="screen-list-item"
          onClick={() => onSelectScreen(index)}
        >
          {screen.name || `Screen ${index + 1}`}
        </div>
      ))}
    </div>
  );
}
