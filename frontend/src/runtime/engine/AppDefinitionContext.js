// frontend/src/runtime/engine/AppDefinitionContext.js

import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * AppDefinitionContext
 * ---------------------------------------------------------
 * Provides the normalized app definition to the runtime.
 * Ensures:
 * - predictable structure
 * - stable screen list
 * - stable component definitions
 * - stable metadata + theme
 */

const AppContext = createContext(null);

export function AppDefinitionProvider({ app, children }) {
  const [definition, setDefinition] = useState(() => normalize(app));

  useEffect(() => {
    setDefinition(normalize(app));
  }, [app]);

  return (
    <AppContext.Provider value={definition}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppDefinition() {
  return useContext(AppContext);
}

/**
 * Normalize the app definition into a stable structure.
 */
function normalize(app) {
  if (!app || typeof app !== "object") {
    return {
      screens: [],
      components: {},
      theme: {},
      metadata: {},
      initialScreen: null,
    };
  }

  return {
    screens: normalizeScreens(app.screens),
    components: app.components || {},
    theme: app.theme || {},
    metadata: app.metadata || {},
    initialScreen: app.initialScreen || null,
  };
}

/**
 * Normalize screens into a clean array.
 */
function normalizeScreens(screens) {
  if (!screens) return [];

  if (Array.isArray(screens)) return screens;

  // Convert dictionary → array
  return Object.keys(screens).map((key) => ({
    id: key,
    ...screens[key],
  }));
}
