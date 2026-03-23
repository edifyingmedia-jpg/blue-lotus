// frontend/src/runtime/resolver/ScreenEngine.js

/**
 * ScreenEngine.js
 * ---------------------------------------------------------
 * Central runtime engine for managing the active screen.
 *
 * Responsibilities:
 *  - Hold the active screen object
 *  - Provide a stable API for setting/changing screens
 *  - Expose screen state through useScreenEngine()
 *
 * This replaces the legacy JSON-based screen registry.
 */

import { useState } from "react";

let _setActiveScreen = null;

/**
 * Hook used by SceneManager, ScreenRenderer, and ScreenContext.
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
    console.warn("[ScreenEngine] setActiveScreen called before initialization.");
  }
}
