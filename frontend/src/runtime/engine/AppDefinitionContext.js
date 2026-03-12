import React, { createContext, useContext } from "react";

const AppContext = createContext(null);

export function AppDefinitionProvider({ app, children }) {
  return (
    <AppContext.Provider value={app}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppDefinition() {
  return useContext(AppContext);
}
