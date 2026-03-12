import React, { createContext, useContext, useState } from "react";
import DynamicScreen from "./DynamicScreen";

const NavigationContext = createContext();

export function NavigationProvider({ app, children }) {
  const [currentScreen, setCurrentScreen] = useState(app.home || "Home");

  const navigate = (screenName) => {
    if (app.screens[screenName]) {
      setCurrentScreen(screenName);
    } else {
      console.warn(`Screen "${screenName}" does not exist in app definition.`);
    }
  };

  return (
    <NavigationContext.Provider value={{ currentScreen, navigate }}>
      {children}
      <DynamicScreen screen={app.screens[currentScreen]} />
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  return useContext(NavigationContext);
}
