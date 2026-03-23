// frontend/src/runtime/screens/ScreenContext.js

/**
 * ScreenContext.js
 * ---------------------------------------------------------
 * Provides the active screen object to the runtime.
 *
 * Responsibilities:
 *  - Expose the active screen from ScreenEngine
 *  - Provide useScreen() hook for components
 *  - Keep screen state isolated and deterministic
 */

import React, { createContext, useContext } from "react";
import { useScreenEngine } from "../resolver/ScreenEngine";

const ScreenContext = createContext(null);

/**
 * Provider used by SceneManager and RuntimeApp.
 */
export function ScreenProvider({ children }) {
  const { activeScreen } = useScreenEngine();

  return (
    <ScreenContext.Provider value={activeScreen}>
      {children}
    </ScreenContext.Provider>
  );
}

/**
 * Hook used by components to access the active screen.
 */
export function useScreen() {
  const ctx = useContext(ScreenContext);

  if (!ctx) {
    console.warn("[ScreenContext] useScreen() called outside provider.");
    return null;
  }

  return ctx;
}
