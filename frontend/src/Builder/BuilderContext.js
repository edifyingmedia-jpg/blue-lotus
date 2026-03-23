import React, { createContext, useContext, useState } from "react";

const BuilderContext = createContext(null);

export function BuilderProvider({ children }) {
  const [screens, setScreens] = useState([]);
  const [components, setComponents] = useState([]);
  const [routes, setRoutes] = useState([]);

  const value = {
    screens,
    setScreens,
    components,
    setComponents,
    routes,
    setRoutes
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

export default BuilderContext;
