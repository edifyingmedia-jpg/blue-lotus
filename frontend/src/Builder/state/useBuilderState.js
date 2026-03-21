// frontend/src/Builder/state/useBuilderState.js

/**
 * useBuilderState
 * ---------------------------------------------------------
 * Centralized state for the Builder UI.
 * Holds screens, components, metadata, and project structure.
 */

import { useState, useCallback } from "react";

export function useBuilderState(initialState = null) {
  const [builderState, setBuilderState] = useState(
    initialState || {
      screens: [],
      components: [],
      metadata: {
        name: "Untitled App",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    }
  );

  /**
   * updateBuilderState
   * -------------------------------------------------------
   * Safely updates the Builder state with partial patches.
   */
  const updateBuilderState = useCallback((patch) => {
    setBuilderState((prev) => ({
      ...prev,
      ...patch,
      metadata: {
        ...prev.metadata,
        updatedAt: Date.now(),
      },
    }));
  }, []);

  return {
    builderState,
    updateBuilderState,
  };
}
