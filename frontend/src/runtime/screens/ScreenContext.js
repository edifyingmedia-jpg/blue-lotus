/**
 * ScreenContext.js
 * ----------------------------------------------------
 * Provides React context for the currently rendered screen.
 *
 * This allows deeply nested components to access:
 * - the current screen object
 * - screen-level props
 * - runtime bindings
 *
 * This context is used by:
 * - ScreenRenderer
 * - SceneManager
 * - ComponentResolver-driven components
 */

import React, { createContext, useContext } from "react";

const ScreenContext = createContext(null);

export function ScreenProvider({ screen, bindings, children }) {
  const value = {
    screen,
    bindings,
  };

  return (
    <ScreenContext.Provider value={value}>
      {children}
    </ScreenContext.Provider>
  );
}

export function useScreenContext() {
  return useContext(ScreenContext);
}

export default ScreenContext;
