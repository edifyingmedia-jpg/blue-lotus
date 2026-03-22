// frontend/src/runtime/RenderScreen.js

/**
 * RenderScreen
 * ---------------------------------------------------------
 * Renders the active screen based on the current route.
 * This is a thin wrapper around DynamicScreen that provides
 * a stable mount point for the runtime and preview engine.
 */

import React from "react";
import DynamicScreen from "./DynamicScreen";

export default function RenderScreen({
  appDefinition,
  navigation,
  state,
  dispatcher,
}) {
  if (!navigation) {
    console.warn("[RenderScreen] Missing navigation engine");
    return null;
  }

  const routeName = navigation.getCurrentRoute();

  if (!routeName) {
    console.warn("[RenderScreen] No active route to render");
    return null;
  }

  return (
    <div className="bl-render-screen" data-route={routeName}>
      <DynamicScreen
        appDefinition={appDefinition}
        routeName={routeName}
        state={state}
        dispatcher={dispatcher}
      />
    </div>
  );
}
