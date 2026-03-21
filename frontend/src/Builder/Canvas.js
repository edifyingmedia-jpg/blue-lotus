// frontend/src/Builder/Canvas.js

/**
 * Canvas (Builder)
 * ---------------------------------------------------------
 * The main editing surface where the active screen is rendered.
 * Uses ScreenRenderer to display the component tree.
 */

import React from "react";
import { useBuilder } from "./BuilderContext";
import ScreenRenderer from "./ScreenRenderer";

export default function Canvas() {
  const { builderState } = useBuilder();
  const { currentScreen } = builderState;

  if (!currentScreen) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
          fontSize: 16,
        }}
      >
        No screen selected.
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        padding: 20,
        overflow: "auto",
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          margin: "0 auto",
          width: "100%",
          maxWidth: 480,
          minHeight: 640,
          background: "white",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          padding: 16,
        }}
      >
        <ScreenRenderer screenId={currentScreen} />
      </div>
    </div>
  );
}
