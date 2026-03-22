// frontend/src/runtime/RuntimeApp.jsx

/**
 * RuntimeApp
 * ---------------------------------------------------------
 * The root component for the Blue Lotus runtime.
 * Initializes the RuntimeEngine and renders the active screen.
 */

import React, { useEffect, useState } from "react";
import RuntimeEngine from "./RuntimeEngine";
import RenderScreen from "./RenderScreen";

export default function RuntimeApp({ appDefinition }) {
  const [engine] = useState(() => new RuntimeEngine());
  const [route, setRoute] = useState(null);
  const [stateSnapshot, setStateSnapshot] = useState({});

  // Initialize runtime when appDefinition changes
  useEffect(() => {
    if (!appDefinition) return;

    engine.load(appDefinition);

    // Subscribe to route + state changes
    engine.onRouteChange = (newRoute) => setRoute(newRoute);
    engine.onStateChange = (newState) => setStateSnapshot(newState);

    // Set initial values
    setRoute(engine.getCurrentRoute());
    setStateSnapshot(engine.getState());
  }, [appDefinition, engine]);

  if (!route) {
    return <div>Loading…</div>;
  }

  return (
    <div className="bl-runtime-app">
      <RenderScreen
        appDefinition={appDefinition}
        navigation={engine.navigation}
        state={engine.state}
        dispatcher={engine.dispatcher}
      />
    </div>
  );
}
