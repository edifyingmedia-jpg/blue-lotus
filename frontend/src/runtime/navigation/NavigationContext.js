// frontend/src/runtime/navigation/NavigationContext.js

/**
 * NavigationContext.js
 * ---------------------------------------------------------
 * Provides navigation helpers and exposes the active screen
 * to the runtime. This is the glue between NavigationEngine
 * and the React component tree.
 */

import React, { createContext, useContext } from "react";
import { setActiveScreen } from "../resolver/ScreenEngine";

const NavigationContext = createContext(null);

/**
 * Provider used by RuntimeApp / SceneManager.
 */
export function NavigationProvider({ children }) {
  const api = {
    navigate: (screenName, params = {}) => {
      setActiveScreen({ name: screenName, params });
    },
  };

  return (
    <NavigationContext.Provider value={api}>
      {children}
    </NavigationContext.Provider>
  );
}

/**
 * Hook used by components and actions to trigger navigation.
 */
export function useNavigation() {
  const ctx = useContext(NavigationContext);

  if (!ctx) {
    console.warn("[NavigationContext] useNavigation() called outside provider.");
    return {
      navigate: () => {},
    };
  }

  return ctx;
}
