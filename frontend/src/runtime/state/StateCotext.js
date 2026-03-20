// frontend/src/runtime/state/StateContext.js

/**
 * StateContext.js
 * ---------------------------------------------------------
 * Global runtime state for Blue Lotus apps.
 *
 * Responsibilities:
 *  - Provide a shared state store for the runtime
 *  - Allow components to read/write state
 *  - Support actions, variables, and data binding
 */

import React, { createContext, useContext, useState, useCallback } from "react";

const StateContext = createContext(null);

export function useRuntimeState() {
  return useContext(StateContext);
}

export default function StateProvider({ initialState = {}, children }) {
  const [state, setState] = useState(initialState);

  /**
   * Update a single key in the state
   */
  const setValue = useCallback((key, value) => {
    setState((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  /**
   * Update multiple keys at once
   */
  const setValues = useCallback((updates) => {
    setState((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  /**
   * Reset state to initial
   */
  const resetState = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  const value = {
    state,
    setValue,
    setValues,
    resetState,
  };

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
}
