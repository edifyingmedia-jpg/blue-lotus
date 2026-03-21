// frontend/src/Builder/components/ScreenList/AddScreenButton.js

/**
 * AddScreenButton
 * ---------------------------------------------------------
 * Button for creating a new screen inside the Builder.
 */

import React from "react";

export function AddScreenButton({ onAdd }) {
  return (
    <button
      className="add-screen-button"
      onClick={onAdd}
    >
      + Add Screen
    </button>
  );
}
