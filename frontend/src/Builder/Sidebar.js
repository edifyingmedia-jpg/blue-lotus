// frontend/src/Builder/Sidebar.js

/**
 * Sidebar (Builder)
 * ---------------------------------------------------------
 * Displays the list of screens and allows selecting which
 * screen is active in the Builder Canvas.
 */

import React from "react";
import { useBuilder } from "./BuilderContext";

export default function Sidebar() {
  const { builderState, actions } = useBuilder();
  const { screens, currentScreen } = builderState;

  return (
    <div
      style={{
        width: 240,
        background: "#f7f9fc",
        borderRight: "1px solid #e2e8f0",
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Screens</h3>

      {Object.values(screens).map((screen) => {
        const isActive = currentScreen === screen.id;

        return (
          <div
            key={screen.id}
            onClick={() => actions.setCurrentScreen(screen.id)}
            style={{
              padding: "8px 10px",
              borderRadius: 6,
              cursor: "pointer",
              background: isActive ? "#e3f2ff" : "transparent",
              border: isActive ? "1px solid #90c7ff" : "1px solid transparent",
              transition: "0.15s ease",
            }}
          >
            {screen.name || screen.id}
          </div>
        );
      })}
    </div>
  );
}
