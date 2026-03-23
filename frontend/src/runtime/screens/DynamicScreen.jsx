// frontend/src/runtime/screens/DynamicScreen.jsx

/**
 * DynamicScreen.jsx
 * ---------------------------------------------------------
 * Resolves and renders the active runtime screen.
 *
 * This component is the bridge between:
 *  - Runtime navigation state
 *  - Screen resolution engine
 *  - Screen renderer
 */

import React, { useEffect, useState } from "react";
import screenEngine from "./ScreenEngine";
import ScreenRenderer from "./ScreenRenderer";

export default function DynamicScreen({ runtime }) {
  const [screen, setScreen] = useState(null);

  useEffect(() => {
    if (!runtime) return;

    const updateScreen = (route) => {
      const resolved = screenEngine.load(route?.screen);
      setScreen(resolved);
    };

    // Initial render
    updateScreen(runtime.getCurrentRoute());

    // Subscribe to navigation changes
    runtime.onRouteChange = updateScreen;

    return () => {
      runtime.onRouteChange = null;
    };
  }, [runtime]);

  if (!screen) return null;

  return <ScreenRenderer screen={screen} />;
}
