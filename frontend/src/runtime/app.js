import React from "react";
import { NavigationProvider, useNavigation } from "./engine/NavigationEngine";
import Screen from "./engine/Screen";
import ToastContainer from "./components/ToastContainer";
import ModalHost from "./components/ModalHost";
import DrawerHost from "./components/DrawerHost";
import { AppDefinitionProvider, useAppDefinition } from "./engine/AppDefinitionContext";

/**
 * Renders the current screen based on navigation state.
 */
function RuntimeScreen() {
  const { currentScreen } = useNavigation();
  const { screens } = useAppDefinition();

  const screenDef = screens[currentScreen];

  if (!screenDef) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Screen not found</h2>
        <p>No screen definition for: {currentScreen}</p>
      </div>
    );
  }

  return <Screen screen={screenDef} />;
}

/**
 * Root runtime shell.
 * Wraps the entire app in providers and renders the active screen.
 */
export default function App() {
  return (
    <AppDefinitionProvider>
      <NavigationProvider initialScreen="home">
        <ToastContainer />
        <ModalHost />
        <DrawerHost />
        <RuntimeScreen />
      </NavigationProvider>
    </AppDefinitionProvider>
  );
}
