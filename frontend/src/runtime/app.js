// frontend/src/runtime/App.js

import React from "react";
import { NavigationProvider } from "./engine/NavigationEngine";
import ScreenEngine from "./engine/ScreenEngine";
import screens from "./screens";

/**
 * App
 * ---------------------------------------------------------
 * Root of the runtime.
 * - Initializes navigation
 * - Loads screen registry
 * - Renders the active screen
 */

export default function App() {
  return (
    <NavigationProvider>
      <ScreenEngine screens={screens} />
    </NavigationProvider>
  );
}
