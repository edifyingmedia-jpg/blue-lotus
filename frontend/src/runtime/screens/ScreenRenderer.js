// frontend/src/runtime/screens/ScreenRenderer.js

/**
 * ScreenRenderer.js
 * ---------------------------------------------------------
 * Renders a screen inside the runtime environment.
 *
 * Responsibilities:
 *  - Wrap the screen in ScreenProvider
 *  - Render the screen's component tree via DynamicScreen
 *  - Provide a stable visual container for transitions/layout
 */

import React from "react";
import ScreenProvider from "./ScreenContext";
import DynamicScreen from "../resolver/DynamicScreen";
import { useScreenEngine } from "../resolver/ScreenEngine";

export default function ScreenRenderer() {
  const { activeScreen } = useScreenEngine();

  if (!activeScreen) {
    return (
      <div
        style={{
          padding: 20,
          color: "red",
          fontSize: 16,
          fontWeight: "bold",
        }}
      >
        No active screen to render.
      </div>
    );
  }

  return (
    <ScreenProvider>
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        <DynamicScreen screen={activeScreen} />
      </div>
    </ScreenProvider>
  );
}
