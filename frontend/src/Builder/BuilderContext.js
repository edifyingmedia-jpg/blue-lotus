// frontend/src/Builder/BuilderContext.js

/**
 * BuilderContext
 * ---------------------------------------------------------
 * Provides builder-level context to the entire Builder UI.
 *
 * Exposes:
 * - builderState: full state tree for the builder
 * - dispatch: builder reducer dispatcher
 * - selected: currently selected component
 * - project: active project metadata
 * - actions: builder action helpers
 */

import React, { createContext, useContext } from "react";

export const BuilderContext = createContext(null);

export function BuilderProvider({
  builderState,
  dispatch,
  actions,
  project,
  children
}) {
  const value = {
    builderState,
    dispatch,
    actions,
    selected: builderState?.selected || null,
    project
  };

  return (
    <BuilderContext.Provider value={value}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const ctx = useContext(BuilderContext);
  if (!ctx) {
    throw new Error("useBuilder must be used inside <BuilderProvider>");
  }
  return ctx;
}
