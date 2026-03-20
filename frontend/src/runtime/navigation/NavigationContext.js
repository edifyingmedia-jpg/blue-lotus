// frontend/src/runtime/navigation/NavigationContext.js

/**
 * NavigationContext
 * ---------------------------------------------------------
 * Provides navigation helpers to the UI.
 * Exposes:
 * - navigate(screen, params)
 * - goBack()   (optional)
 */

import React, { createContext, useContext } from "react";

export const NavigationContext = createContext(null);

export function NavigationProvider({ navigation, children }) {
  return (
    <NavigationContext.Provider value={navigation}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error("useNavigation must be used inside <NavigationProvider>");
  }
  return ctx;
}
