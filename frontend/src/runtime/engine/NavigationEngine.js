import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * Navigation context for the runtime.
 * Provides: currentScreen, navigate(), goBack(), stack
 */

const NavigationContext = createContext(null);

export const NavigationProvider = ({ initialScreen = "home", children }) => {
  // Navigation stack: ["home", "settings", "profile"]
  const [stack, setStack] = useState([initialScreen]);

  const currentScreen = stack[stack.length - 1];

  const navigate = (to) => {
    if (!to) return;
    setStack((prev) => [...prev, to]);

    window.dispatchEvent(
      new CustomEvent("runtime-navigation", {
        detail: { type: "navigate", to },
      })
    );
  };

  const goBack = () => {
    setStack((prev) => {
      if (prev.length <= 1) return prev; // cannot go back past root
      const newStack = prev.slice(0, prev.length - 1);

      window.dispatchEvent(
        new CustomEvent("runtime-navigation", {
          detail: { type: "back", to: newStack[newStack.length - 1] },
        })
      );

      return newStack;
    });
  };

  // Listen for ActionEngine navigation events
  useEffect(() => {
    const handler = (e) => {
      const { type, to } = e.detail || {};

      if (type === "navigate") navigate(to);
      if (type === "back") goBack();
    };

    window.addEventListener("runtime-navigation", handler);
    return () => window.removeEventListener("runtime-navigation", handler);
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        currentScreen,
        navigate,
        goBack,
        stack,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    console.warn("useNavigation must be used inside <NavigationProvider>");
  }
  return ctx;
};
