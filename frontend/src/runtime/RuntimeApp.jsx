// frontend/src/runtime/RuntimeApp.jsx

/**
 * RuntimeApp
 * ---------------------------------------------------------
 * Root React entry point for the Blue Lotus runtime.
 *
 * Responsibilities:
 *  - Initialize RuntimeEngine once
 *  - Bridge runtime events into React
 *  - Render the active screen via the screen pipeline
 */

import React, { useEffect, useState } from "react";
import RuntimeEngine from "./RuntimeEngine";
import { ScreenProvider } from "./screens/ScreenContext";
import DynamicScreen from "./screens/DynamicScreen";

export default function RuntimeApp({ appDefinition }) {
  const [engine] = useState(() => new RuntimeEngine());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!appDefinition) return;

    engine.load(appDefinition);
    setReady(true);
  }, [appDefinition, engine]);

  if (!ready) {
    return <div>Loading…</div>;
  }

  return (
    <div className="bl-runtime-app">
      <ScreenProvider>
        <DynamicScreen runtime={engine} />
      </ScreenProvider>
    </div>
  );
}
