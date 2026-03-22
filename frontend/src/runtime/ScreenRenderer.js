// frontend/src/runtime/ScreenRenderer.js

/**
 * ScreenRenderer
 * ---------------------------------------------------------
 * A compatibility wrapper used by older parts of the system.
 * In the modern runtime, screens are rendered through:
 *
 *   RuntimeRenderer → RenderScreen → DynamicScreen
 *
 * This wrapper simply forwards the call to RenderScreen
 * using the current route. It exists to avoid breaking
 * older imports while the new runtime architecture is active.
 */

import React from "react";
import RenderScreen from "./RenderScreen";

export default function ScreenRenderer({
  appDefinition,
  navigation,
  state,
  dispatcher,
}) {
  if (!navigation) {
    console.warn("[ScreenRenderer] Missing navigation engine");
    return null;
  }

  const routeName = navigation.getCurrentRoute();

  if (!routeName) {
    console.warn("[ScreenRenderer] No active route to render");
    return null;
  }

  return (
    <div className="bl-screen-renderer" data-route={routeName}>
      <RenderScreen
        appDefinition={appDefinition}
        navigation={navigation}
        state={state}
        dispatcher={dispatcher}
      />
    </div>
  );
}
