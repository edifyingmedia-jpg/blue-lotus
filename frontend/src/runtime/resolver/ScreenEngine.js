// frontend/src/runtime/resolver/ScreenEngine.js

/**
 * ScreenEngine.js
 * ---------------------------------------------------------
 * The logic engine for runtime screens.
 *
 * Responsibilities:
 *  - Manage the active screen
 *  - Provide navigation helpers
 *  - Pass the active screen to DynamicScreen
 */

import React, { createContext, useContext, useState, useMemo } from "react";
import DynamicScreen from "./DynamicScreen";

const ScreenContext = createContext(null);

export function useScreenEngine() {
  return useContext(ScreenContext);
}

export default function ScreenEngine({ screens = [], initialScreen, children }) {
  const [active, setActive] = useState(initialScreen || screens[0]?.id || null);

  const screenMap = useMemo(() => {
    const map = {};
    screens.forEach((s) => (map[s.id] = s));
    return map;
  }, [screens]);

  function navigate(screenId) {
    if (!screenMap[screenId]) {
      console.warn(`ScreenEngine: Unknown screen "${screenId}"`);
      return;
    }
    setActive(screenId);
  }

  const value = {
    activeScreenId: active,
    activeScreen: screenMap[active] || null,
    navigate,
    screens,
  };

  return (
    <ScreenContext.Provider value={value}>
      {children}

      {/* Render the active screen */}
      {value.activeScreen && (
        <DynamicScreen screen={value.activeScreen} />
      )}
    </ScreenContext.Provider>
  );
}
