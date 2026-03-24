/**
 * useNavigation.js
 * ----------------------------------------------------
 * React hook that exposes the public navigation API.
 *
 * This hook wraps navigation.js, which wraps the
 * NavigationEngine instance initialized by RuntimeEngine.
 *
 * Components use this hook to:
 * - navigate between screens
 * - read the current screen
 *
 * No stacks, no routes arrays, no legacy navigation.
 */

import { useState, useEffect } from "react";
import {
  navigate,
  getCurrentScreen,
  getNavigationEngine,
} from "./navigation";

export default function useNavigation() {
  const [screen, setScreen] = useState(() => getCurrentScreen());

  useEffect(() => {
    const engine = getNavigationEngine();
    if (!engine) return;

    // Subscribe to screen changes
    const unsubscribe = engine.subscribe((newScreen) => {
      setScreen(newScreen);
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  return {
    navigate,
    currentScreen: screen,
  };
}
