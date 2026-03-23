// frontend/src/runtime/screens/ScreenEngine.js

/**
 * ScreenEngine.js
 * ---------------------------------------------------------
 * Central runtime engine for screen state.
 *
 * Responsibilities:
 *  - Hold the active screen object
 *  - Expose screen metadata through useScreenEngine()
 *  - Provide a stable API for ScreenRenderer + DynamicScreen
 *
 * This replaces the legacy JSON-based screen registry.
 */

import { useState, useCallback } from "react";

let _setActiveScreen = null;

/**
 * Hook used by ScreenRenderer and ScreenContext.
 */
export function useScreenEngine() {
  const [activeScreen, setActiveScreen] = useState(null);

  // Expose setter globally so NavigationEngine can update screens
  _setActiveScreen = setActiveScreen;

  return {
    activeScreen,
    setActiveScreen,
  };
}

/**
 * External API used by NavigationEngine or RuntimeEngine
 * to change screens deterministically.
 */
export function setActiveScreen(screenObject) {
  if (typeof _setActiveScreen === "function") {
    _setActiveScreen(screenObject);
  } else {
    console.warn("ScreenEngine not initialized yet.");
  }
}
