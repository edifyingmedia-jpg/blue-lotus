// frontend/src/Builder/ScreenRenderer.js

/**
 * ScreenRenderer (Builder)
 * ---------------------------------------------------------
 * Renders an entire screen inside the Builder Canvas.
 * Uses ComponentRenderer to recursively render the component tree.
 */

import React from "react";
import { useBuilder } from "./BuilderContext";
import ComponentRenderer from "./ComponentRenderer";

export default function ScreenRenderer({ screenId }) {
  const { builderState } = useBuilder();
  const screen = builderState.screens[screenId];

  if (!screen) {
    return (
      <div
        style={{
          padding: 20,
          border: "1px solid red",
          background: "#ffe6e6",
          margin: 10,
        }}
      >
        Screen not found: {screenId}
      </div>
    );
  }

  const root = screen.root;

  if (!root) {
    return (
      <div
        style={{
          padding: 20,
          border: "1px solid orange",
          background: "#fff4e6",
          margin: 10,
        }}
      >
        Screen has no root component.
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ComponentRenderer node={root} />
    </div>
  );
}
