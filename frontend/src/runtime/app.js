import React from "react";
import { NavigationProvider, useNavigation } from "./engine/NavigationEngine";
import Renderer from "./engine/Renderer";

function ScreenHost({ appDefinition }) {
  const { current } = useNavigation();
  const screen = appDefinition.screens[current];

  if (!screen) {
    console.warn(`Screen "${current}" not found in appDefinition`);
    return null;
  }

  return <Renderer tree={screen} />;
}

export default function App({ appDefinition }) {
  const initialScreen = appDefinition?.initial || "Home";

  return (
    <NavigationProvider initialScreen={initialScreen}>
      <ScreenHost appDefinition={appDefinition} />
    </NavigationProvider>
  );
}
