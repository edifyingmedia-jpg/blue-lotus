// frontend/src/runtime/screens/ScreenRenderer.jsx

/**
 * ScreenRenderer.jsx
 * ---------------------------------------------------------
 * React component wrapper for rendering the active screen.
 *
 * This JSX version is used by:
 *  - RuntimeRenderer
 *  - LivePreview
 *  - PreviewHost
 *
 * Responsibilities:
 *  - Wrap the active screen in ScreenProvider
 *  - Render the screen's component tree via DynamicScreen
 *  - Provide a stable DOM container for layout + transitions
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
    <ScreenProvider screen={activeScreen}>
      <div
        className="bl-screen-renderer"
        data-screen={activeScreen?.name}
        style={{ width: "100%", height: "100%" }}
      >
        <DynamicScreen screen={activeScreen} />
      </div>
    </ScreenProvider>
  );
}
