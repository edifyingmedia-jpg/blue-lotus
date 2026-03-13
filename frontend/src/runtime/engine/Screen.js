// frontend/src/runtime/engine/Screen.js

import React from "react";
import DynamicScreen from "./DynamicScreen";

/**
 * Screen
 * ---------------------------------------------------------
 * Wraps a screen definition and renders its components
 * using DynamicScreen.
 */

export default function Screen({ name, components = [], params = {} }) {
  return (
    <div style={screenStyle}>
      <DynamicScreen components={components} params={params} />
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
