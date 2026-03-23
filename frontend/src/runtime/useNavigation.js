// frontend/src/runtime/useNavigation.js

/**
 * useNavigation.js
 * ---------------------------------------------------------
 * React hook providing safe, deterministic access to the
 * Blue Lotus navigation API.
 *
 * This hook wraps the public navigation.js module, which
 * itself wraps NavigationEngine.
 *
 * Rules:
 *  - Route-based navigation only
 *  - No stacks, no screens, no legacy models
 *  - Deterministic, predictable, safe
 *  - Never throws if navigation is not initialized
 */

import { useCallback } from "react";
import navigation from "./navigation";

export default function useNavigation() {
  /**
   * Navigate to a route.
   */
  const navigate = useCallback((routeName, params = {}) => {
    navigation.navigate(routeName, params);
  }, []);

  /**
   * Replace the current route.
   */
  const replace = useCallback((routeName, params = {}) => {
    navigation.replace(routeName, params);
  }, []);

  /**
   * Reset the entire navigation state.
   */
  const reset = useCallback((routeName, params = {}) => {
    navigation.reset(routeName, params);
  }, []);

  /**
   * Get the current route name.
   */
  const getCurrentRoute = useCallback(() => {
    return navigation.getCurrentRoute();
  }, []);

  return {
    navigate,
    replace,
    reset,
    getCurrentRoute,
  };
}
