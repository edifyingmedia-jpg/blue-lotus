/**
 * ThemeProvider.js
 * ----------------------------------------------------
 * React provider that exposes the active theme and
 * theme mode to the component tree.
 *
 * This provider listens to ThemeEngine updates and
 * re-renders consumers when the theme changes.
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import ThemeEngine from "./ThemeEngine";

const ThemeContext = createContext({
  theme: ThemeEngine.getTheme(),
  mode: ThemeEngine.getMode(),
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(ThemeEngine.getTheme());
  const [mode, setMode] = useState(ThemeEngine.getMode());

  useEffect(() => {
    const unsubscribe = ThemeEngine.subscribe((newTheme, newMode) => {
      setTheme({ ...newTheme });
      setMode(newMode);
    });

    return unsubscribe;
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, mode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}

export default ThemeProvider;
