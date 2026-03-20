// frontend/src/runtime/screens/ScreenContext.js

/**
 * ScreenContext.js
 * ---------------------------------------------------------
 * Provides screen-level context for runtime components.
 *
 * Responsibilities:
 *  - Expose the active screen object
 *  - Provide screen metadata (id, name, params)
 *  - Support screen-level helpers
 */

import React, { createContext, useContext } from "react";
import { useScreenEngine } from "../resolver/ScreenEngine";

const ScreenContext = createContext(null);

export function useScreen() {
  return useContext(ScreenContext);
}

export default function ScreenProvider({ children }) {
  const { activeScreen } = useScreenEngine();

  const value = {
    id: activeScreen?.id || null,
    name: activeScreen?.name || null,
    params: activeScreen?.params || {},
    screen: activeScreen || null,
  };

  return (
    <ScreenContext.Provider value={value}>
      {children}
    </ScreenContext.Provider>
  );
}
