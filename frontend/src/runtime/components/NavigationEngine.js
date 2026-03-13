// frontend/src/runtime/engine/NavigationEngine.js

import React, { createContext, useContext, useState, useCallback } from "react";

/**
 * NavigationEngine
 * ---------------------------------------------------------
 * A simple, stable, stack-based navigation engine for Blue Lotus.
 * - push(screen, params)
 * - replace(screen, params)
 * - goBack()
 * - getCurrent()
 * - emits navigation events
 */

const NavigationContext = createContext(null);

export function NavigationProvider({ children }) {
  const [stack, setStack] = useState([
    { screen: "Home", params: {} } // default root
  ]);

  // Push a new screen onto the stack
  const push = useCallback((screen, params = {}) => {
    setStack((prev) => [...prev, { screen, params }]);
  }, []);

  // Replace the current screen
  const replace = useCallback((screen, params = {}) => {
    setStack((prev) => {
      const newStack = [...prev];
      newStack[newStack.length - 1] = { screen, params };
      return newStack;
    });
  }, []);

  // Go back one screen
  const goBack = useCallback(() => {
    setStack((prev) => {
      if (prev.length > 1) return prev.slice(0, -1);
      return prev; // cannot go back past root
    });
  }, []);

  // Get the current screen object
  const getCurrent = useCallback(() => {
    return stack[stack.length - 1];
  }, [stack]);

  const value = {
    stack,
    push,
    replace,
    goBack,
    getCurrent,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error("useNavigation must be used inside NavigationProvider");
  }
  return ctx;
}
