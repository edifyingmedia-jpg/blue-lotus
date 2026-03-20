// frontend/src/runtime/resolver/ScreenLoader.js

/**
 * ScreenLoader.js
 * ---------------------------------------------------------
 * Loads the project's screens into the runtime.
 *
 * Responsibilities:
 *  - Accept the full project object
 *  - Extract screens and prepare them for ScreenEngine
 *  - Pass initialScreen and screen list to ScreenEngine
 */

import React from "react";
import ScreenEngine from "./ScreenEngine";

export default function ScreenLoader({ project, children }) {
  if (!project) {
    return (
      <div
        style={{
          padding: 20,
          color: "red",
          fontSize: 16,
          fontWeight: "bold",
        }}
      >
        No project provided to ScreenLoader.
      </div>
    );
  }

  const screens = project.screens || [];
  const initialScreen = project.initialScreen || screens[0]?.id || null;

  if (screens.length === 0) {
    return (
      <div
        style={{
          padding: 20,
          color: "red",
          fontSize: 16,
          fontWeight: "bold",
        }}
      >
        This project has no screens.
      </div>
    );
  }

  return (
    <ScreenEngine screens={screens} initialScreen={initialScreen}>
      {children}
    </ScreenEngine>
  );
}
