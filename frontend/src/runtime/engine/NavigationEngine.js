import React, { createContext, useContext, useState } from "react";

const NavigationContext = createContext();

export function NavigationProvider({ initialScreen, children }) {
  const [current, setCurrent] = useState(initialScreen);

  const navigate = (screenName) => {
    setCurrent(screenName);
  };

  return (
    <NavigationContext.Provider value={{ current, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  return useContext(NavigationContext);
}
