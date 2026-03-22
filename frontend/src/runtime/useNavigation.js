// frontend/src/runtime/useNavigation.js

import { useState, useCallback, useMemo } from "react";

/**
 * useNavigation
 *
 * The runtime navigation hook for Blue Lotus.
 * Provides:
 *  - currentRoute state
 *  - navigate() function
 *  - initialRoute handling
 *
 * It does NOT:
 *  - simulate navigation
 *  - invent routes
 *  - mutate the appDefinition
 */
export default function useNavigation({ routes, initialRoute }) {
  const validInitial = useMemo(() => {
    if (!routes || typeof routes !== "object") return null;
    if (initialRoute && routes[initialRoute]) return initialRoute;

    // fallback to first route in map
    const keys = Object.keys(routes);
    return keys.length > 0 ? keys[0] : null;
  }, [routes, initialRoute]);

  const [currentRoute, setCurrentRoute] = useState(validInitial);

  const navigate = useCallback(
    (routeName) => {
      if (!routes || !routes[routeName]) {
        console.warn(`useNavigation: Attempted to navigate to unknown route "${routeName}"`);
        return;
      }
      setCurrentRoute(routeName);
    },
    [routes]
  );

  return {
    currentRoute,
    navigate,
  };
}
