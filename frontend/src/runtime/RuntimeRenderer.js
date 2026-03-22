// frontend/src/runtime/RuntimeRenderer.js

import React, { useState, useMemo, useCallback } from "react";
import ComponentResolver from "./ComponentResolver";
import useNavigation from "./useNavigation";
import useRuntimeDataBindings from "./useRuntimeDataBindings";
import ActionEngine from "./ActionEngine";

/**
 * RuntimeRenderer
 * ---------------------------------------------------------
 * The core runtime engine for Blue Lotus.
 *
 * Responsibilities:
 *  - Manage route state
 *  - Manage runtime app state
 *  - Execute actions
 *  - Bind data to components
 *  - Render the component tree
 *
 * It does NOT:
 *  - invent data
 *  - simulate backend responses
 *  - mutate appDefinition
 */
export default function RuntimeRenderer({
  appDefinition,
  components,
  routes,
  initialRoute,
  onEvent,
}) {
  // ---------------------------------------------
  // Navigation
  // ---------------------------------------------
  const { currentRoute, navigate } = useNavigation({
    routes,
    initialRoute,
  });

  // ---------------------------------------------
  // Runtime App State (future‑ready)
  // ---------------------------------------------
  const [appState, setAppState] = useState({});

  // ---------------------------------------------
  // Action Engine
  // ---------------------------------------------
  const actionEngine = useMemo(() => {
    return new ActionEngine({
      navigate,
      getState: () => appState,
      setState: setAppState,
      onEvent,
    });
  }, [navigate, appState, onEvent]);

  const runAction = useCallback(
    (action) => {
      actionEngine.run(action);
    },
    [actionEngine]
  );

  // ---------------------------------------------
  // Resolve the root component for the current route
  // ---------------------------------------------
  const activeRootId = useMemo(() => {
    if (!routes || !currentRoute) return appDefinition?.rootComponentId;
    return routes[currentRoute]?.rootComponentId || appDefinition?.rootComponentId;
  }, [routes, currentRoute, appDefinition]);

  if (!activeRootId) {
    return (
      <div style={{ padding: 20, color: "#e2e8f0", background: "#020617" }}>
        RuntimeRenderer: No root component found.
      </div>
    );
  }

  // ---------------------------------------------
  // Render
  // ---------------------------------------------
  return (
    <ComponentResolver
      appDefinition={{ rootComponentId: activeRootId }}
      components={components}
      routes={routes}
      initialRoute={initialRoute}
      mode="live"
      onEvent={(evt) => {
        if (evt?.payload?.action) {
          runAction(evt.payload.action);
        }
        if (onEvent) onEvent(evt);
      }}
      bindProps={(node) =>
        useRuntimeDataBindings({
          node,
          appState,
        })
      }
    />
  );
}
