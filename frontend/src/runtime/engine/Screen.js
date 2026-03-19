// frontend/src/runtime/engine/Screen.js

import React from "react";
import DynamicScreen from "./DynamicScreen";

/**
 * Screen
 * ---------------------------------------------------------
 * Wraps a screen definition and renders its components
 * using DynamicScreen.
 *
 * Responsibilities:
 * - Provide layout container
 * - Pass params + dispatch to DynamicScreen
 */

export default function Screen({ name, components = [], params = {}, dispatch }) {
  return (
    <div style={screenStyle}>
      <DynamicScreen
        components={components}
        params={params}
        dispatch={dispatch}
      />
    </div>
  );
}

const screenStyle = {
  width: "100%",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  padding: 20,
  boxSizing: "border-box",
};
