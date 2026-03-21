// frontend/src/Builder/components/ScreenList/ScreenList.js

/**
 * ScreenList
 * ---------------------------------------------------------
 * Displays all screens and provides controls for adding
 * and selecting screens.
 */

import React from "react";
import { AddScreenButton } from "./AddScreenButton";

export function ScreenList({ builderState, onSelectScreen, onAddScreen }) {
  const screens = builderState?.screens || [];

  return (
    <div className="screen-list">
      <div className="screen-list-header">
        <span>Screens</span>
        <AddScreenButton onAdd={onAddScreen} />
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
