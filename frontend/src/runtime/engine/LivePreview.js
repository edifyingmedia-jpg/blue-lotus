// frontend/src/runtime/engine/LivePreview.js

/**
 * LivePreview
 * ---------------------------------------------------------
 * Renders a screen in "live" mode.
 * Used by the editor and by the runtime when previewing.
 *
 * Responsibilities:
 * - Accept a screen definition
 * - Pass props + params
 * - Forward dispatch to DynamicScreen
 */

import React from "react";
import DynamicScreen from "./DynamicScreen";

export default function LivePreview({ screen, params = {}, dispatch }) {
  if (!screen) {
    return (
      <div style={{ padding: 20, color: "red" }}>
        No screen selected.
      </div>
    );
  }

  return (
    <DynamicScreen
      components={screen.components || []}
      params={params}
      dispatch={dispatch}
    />
  );
}
