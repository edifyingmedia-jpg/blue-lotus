import React from "react";
import { NavigationProvider } from "./engine/NavigationEngine";
import { AppDefinitionProvider } from "./engine/AppDefinitionContext";
import Screen from "./engine/Screen";
import ToastContainer from "./components/ToastContainer";
import ModalHost from "./components/ModalHost";
import DrawerHost from "./components/DrawerHost";

/**
 * LivePreview
 *
 * This component is used INSIDE the Blue Lotus builder.
 * It renders the app definition in real time as the user edits screens,
 * components, actions, or navigation.
 *
 * It behaves like App.js, but:
 * - receives the app definition as a prop
 * - re-renders instantly when the builder updates the definition
 * - stays isolated from the main runtime
 */

export default function LivePreview({ app }) {
  if (!app) {
    return (
      <div style={{ padding: 20 }}>
        <h2>No App Loaded</h2>
        <p>The builder has not provided an app definition yet.</p>
      </div>
    );
  }

  return (
    <AppDefinitionProvider app={app}>
      <NavigationProvider initialScreen={app.initialScreen || "home"}>
        <ToastContainer />
        <ModalHost />
        <DrawerHost />
        <PreviewScreen />
      </NavigationProvider>
    </AppDefinitionProvider>
  );
}

/**
 * Renders the current screen inside the preview environment.
 */
function PreviewScreen() {
  return <Screen />;
}
