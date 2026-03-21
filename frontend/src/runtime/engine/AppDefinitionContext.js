// frontend/src/runtime/engine/AppDefinitionContext.js

/**
 * AppDefinitionContext
 * ---------------------------------------------------------
 * Provides runtime access to:
 * - app definition (screens, components)
 * - navigation engine
 * - action engine
 * - global state
 *
 * This is the core context used by all runtime components.
 */

import React, { createContext, useContext } from "react";

const AppDefinitionContext = createContext(null);

export function useAppDefinition() {
  return useContext(AppDefinitionContext);
}

export function AppDefinitionProvider({ app, navigation, actions, state, children }) {
  const value = {
    app,         // full app definition JSON
    navigation,  // NavigationEngine instance
    actions,     // ActionEngine instance
    state,       // Runtime state manager
  };

  return (
    <AppDefinitionContext.Provider value={value}>
      {children}
    </AppDefinitionContext.Provider>
  );
}

export default AppDefinitionContext;
