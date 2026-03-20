// frontend/src/runtime/state/StateContext.js

/**
 * StateContext
 * ---------------------------------------------------------
 * React context wrapper for global runtime state.
 * Exposes:
 * - state
 * - dispatch
 *
 * Responsibilities:
 * - Provide state + dispatch to the UI
 * - Re-render on state changes
 */

import React, { createContext, useContext, useEffect, useState } from "react";

export const StateContext = createContext(null);

export function StateProvider({ stateManager, dispatch, children }) {
  const [state, setState] = useState(stateManager.getState());

  // Subscribe to state changes
  useEffect(() => {
    const unsubscribe = stateManager.subscribe(setState);
    return unsubscribe;
  }, [stateManager]);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
}

// Hook for consuming state + dispatch
export function useStateContext() {
  const ctx = useContext(StateContext);
  if (!ctx) {
    throw new Error("useStateContext must be used inside <StateProvider>");
  }
  return ctx;
}
