// frontend/src/runtime/ScreenRenderer.jsx

/**
 * ScreenRenderer.jsx
 * ---------------------------------------------------------
 * Legacy-compatible JSX wrapper for rendering screens.
 * This exists because older parts of the system imported
 * ScreenRenderer.jsx instead of ScreenRenderer.js.
 *
 * In the modern runtime, all rendering flows through:
 *
 *   RuntimeRenderer → RenderScreen → DynamicScreen
 *
 * This wrapper simply forwards props to RenderScreen to
 * maintain compatibility without breaking the new runtime.
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
    console.warn("[ScreenRenderer.jsx] Missing navigation engine");
    return null;
  }

  const routeName = navigation.getCurrentRoute();

  if (!routeName) {
    console.warn("[ScreenRenderer.jsx] No active route to render");
    return null;
  }

  return (
    <div className="bl-screen-renderer-jsx" data-route={routeName}>
      <RenderScreen
        appDefinition={appDefinition}
        navigation={navigation}
        state={state}
        dispatcher={dispatcher}
      />
    </div>
  );
}
