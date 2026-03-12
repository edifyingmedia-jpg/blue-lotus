import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * AppDefinitionContext
 * Holds the entire app definition used by the runtime engine.
 *
 * Provides:
 * - screens
 * - components
 * - theme
 * - metadata
 * - initialScreen
 * - actions
 * - globalState
 */

const AppContext = createContext(null);

export function AppDefinitionProvider({ app, children }) {
  const [definition, setDefinition] = useState(() => normalize(app));

  // If the app definition changes, normalize again
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
 * Ensures the runtime always receives predictable fields.
 */
function normalize(app) {
  if (!app || typeof app !== "object") {
    return {
      screens: {},
      components: {},
      theme: {},
      metadata: {},
      initialScreen: "home",
      actions: {},
      globalState: {},
    };
  }

  return {
    screens: normalizeScreens(app.screens),
    components: app.components || {},
    theme: app.theme || {},
    metadata: app.metadata || {},
    initialScreen: app.initialScreen || "home",
    actions: app.actions || {},
    globalState: app.globalState || {},
  };
}

/**
 * Convert screens array → dictionary for fast lookup.
 */
function normalizeScreens(screens) {
  if (!screens) return {};

  // If already a dictionary, return as-is
  if (!Array.isArray(screens)) return screens;

  const dict = {};
  screens.forEach((screen) => {
    if (screen && screen.id) {
      dict[screen.id] = screen;
    }
  });

  return dict;
}
