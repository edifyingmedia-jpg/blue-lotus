// frontend/src/runtime/screens/ScreenEngine.js

/**
 * ScreenEngine
 * ---------------------------------------------------------
 * Responsible for:
 * - Selecting the active screen
 * - Passing params to DynamicScreen
 * - Providing ScreenContext to children
 */

import React from "react";
import screens from "./index";
import DynamicScreen from "./DynamicScreen";
import { ScreenProvider } from "./ScreenContext";

export default function ScreenEngine({ current, params = {}, navigation }) {
  const screen = screens[current];

  if (!screen) {
    return (
      <div style={{ padding: 20, color: "red" }}>
        Unknown screen: {current}
      </div>
    );
  }

  return (
    <ScreenProvider screen={current} params={params} navigation={navigation}>
      <DynamicScreen components={screen.components} params={params} />
    </ScreenProvider>
  );
}
