// frontend/src/runtime/LivePreview.js

/**
 * LivePreview
 * ---------------------------------------------------------
 * This component is used INSIDE the Blue Lotus builder.
 * It renders the app definition in real time as the user edits
 * screens, components, actions, or navigation.
 *
 * It now uses the SAME runtime pipeline as the real app:
 *  - RuntimeEngine
 *  - NavigationEngine
 *  - ScreenEngine
 *  - ScreenProvider
 *  - RenderScreen → DynamicScreen → ScreenRenderer
 */

import React, { useEffect, useState } from "react";
import RuntimeEngine from "./RuntimeEngine";
import { ScreenProvider } from "./screens/ScreenContext";
import RenderScreen from "./RenderScreen";

import ToastContainer from "./components/ToastContainer";
import ModalHost from "./components/ModalHost";
import DrawerHost from "./components/DrawerHost";

export default function LivePreview({ app }) {
  const [engine] = useState(() => new RuntimeEngine());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!app) return;

    // Load the updated app definition into the runtime engine
    engine.load(app);
    setReady(true);
  }, [app, engine]);

  if (!app) {
    return (
      <div style={{ padding: 20 }}>
        <h2>No App Loaded</h2>
        <p>The builder has not provided an app definition yet.</p>
      </div>
    );
  }

  if (!ready) {
    return <div>Loading preview…</div>;
  }

  return (
    <ScreenProvider>
      <ToastContainer />
      <ModalHost />
      <DrawerHost />

      <RenderScreen
        appDefinition={app}
        navigation={engine.navigation}
        state={engine.state}
        dispatcher={engine.dispatcher}
      />
    </ScreenProvider>
  );
}
