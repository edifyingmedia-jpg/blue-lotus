// frontend/src/runtime/state/StateLoader.js

/**
 * StateLoader.js
 * ---------------------------------------------------------
 * Loads the project's initial state into the runtime.
 *
 * Responsibilities:
 *  - Accept the full project object
 *  - Extract initial variables/state
 *  - Pass them into StateProvider
 */

import React from "react";
import StateProvider from "./StateContext";

export default function StateLoader({ project, children }) {
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
        No project provided to StateLoader.
      </div>
    );
  }

  const initialState = project.initialState || {};

  return (
    <StateProvider initialState={initialState}>
      {children}
    </StateProvider>
  );
}
