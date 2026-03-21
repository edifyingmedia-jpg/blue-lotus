// frontend/src/Builder/Toolbar.js

/**
 * Toolbar (Builder)
 * ---------------------------------------------------------
 * The top action bar for the Builder. 
 * Currently minimal for 1.0 — screen creation + export hooks.
 */

import React from "react";
import { useBuilder } from "./BuilderContext";

export default function Toolbar() {
  const { actions } = useBuilder();

  return (
    <div
      style={{
        width: "100%",
        height: 48,
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        gap: 12,
      }}
    >
      <button
        onClick={actions.addScreen}
        style={{
          padding: "6px 12px",
          borderRadius: 6,
          border: "1px solid #cbd5e1",
          background: "#f8fafc",
          cursor: "pointer",
        }}
      >
        + Add Screen
      </button>

      <button
        onClick={actions.exportApp}
        style={{
          padding: "6px 12px",
          borderRadius: 6,
          border: "1px solid #cbd5e1",
          background: "#f8fafc",
          cursor: "pointer",
        }}
      >
        Export
      </button>
    </div>
  );
}
