// frontend/src/runtime/resolver/DynamicScreen.js

/**
 * DynamicScreen.js
 * ---------------------------------------------------------
 * Runtime wrapper for rendering a screen.
 *
 * Responsibilities:
 *  - Accept a screen object (id, name, root component)
 *  - Render the screen's component tree using Renderer
 *  - Provide screen-level context for actions + navigation
 */

import React from "react";
import Renderer from "./Renderer";

export default function DynamicScreen({ screen }) {
  if (!screen) {
    return (
      <div
        style={{
          padding: 20,
          color: "red",
          fontSize: 16,
          fontWeight: "bold",
        }}
      >
        No screen provided.
      </div>
    );
  }

  const { name, root } = screen;

  if (!root) {
    return (
      <div
        style={{
          padding: 20,
          color: "red",
          fontSize: 16,
          fontWeight: "bold",
        }}
      >
        Screen "{name}" has no root component.
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Renderer node={root} />
    </div>
  );
}
