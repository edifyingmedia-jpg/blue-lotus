/**
 * DynamicScreen.js
 * ----------------------------------------------------
 * React wrapper that re-renders whenever the current
 * screen changes in the NavigationEngine.
 *
 * Responsibilities:
 *  - Subscribe to navigation events
 *  - Render the current screen via Renderer
 *  - Provide a stable root component for RuntimeApp
 */

import React, { useEffect, useState } from "react";
import eventBus from "./utils/eventBus";

export default function DynamicScreen({ navigationEngine, renderer }) {
  if (!navigationEngine) {
    throw new Error("DynamicScreen requires navigationEngine");
  }
  if (!renderer) {
    throw new Error("DynamicScreen requires renderer");
  }

  const [screenId, setScreenId] = useState(
    navigationEngine.getCurrentScreen()
  );

  useEffect(() => {
    const unsubscribeBefore = eventBus.on("navigation:before", (evt) => {
      // evt: { from, to, params }
      setScreenId(evt.to);
    });

    return () => {
      unsubscribeBefore();
    };
  }, []);

  return renderer.renderScreen(screenId);
}
