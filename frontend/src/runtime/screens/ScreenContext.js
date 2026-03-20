// frontend/src/runtime/screens/ScreenContext.js

/**
 * ScreenContext
 * ---------------------------------------------------------
 * Provides screen-level context to the UI.
 * Exposes:
 * - current screen name
 * - screen params
 * - navigation helpers
 */

import React, { createContext, useContext } from "react";

export const ScreenContext = createContext(null);

export function ScreenProvider({ screen, params = {}, navigation, children }) {
  const value = {
    screen,
    params,
    navigation,
  };

  return (
    <ScreenContext.Provider value={value}>
      {children}
    </ScreenContext.Provider>
  );
}

export function useScreen() {
  const ctx = useContext(ScreenContext);
  if (!ctx) {
    throw new Error("useScreen must be used inside <ScreenProvider>");
  }
  return ctx;
}
