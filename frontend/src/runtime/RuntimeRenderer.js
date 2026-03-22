// frontend/src/runtime/RuntimeRenderer.js

/**
 * RuntimeRenderer
 * ---------------------------------------------------------
 * High-level renderer that connects the RuntimeEngine to the
 * RenderScreen component. This is the top-level rendering
 * layer for the runtime.
 */

import React from "react";
import RenderScreen from "./RenderScreen";

export default function RuntimeRenderer({ appDefinition, engine }) {
  if (!engine) {
    console.warn("[RuntimeRenderer] Missing engine instance");
    return null;
  }

  const navigation = engine.navigation;
  const state = engine.state;
  const dispatcher = engine.dispatcher;

  const routeName = navigation.getCurrentRoute();

  if (!routeName) {
    return <div>Loading…</div>;
  }

  return (
    <div className="bl-runtime-renderer">
      <RenderScreen
        appDefinition={appDefinition}
        navigation={navigation}
        state={state}
        dispatcher={dispatcher}
      />
    </div>
  );
}
