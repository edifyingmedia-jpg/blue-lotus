// frontend/src/runtime/engine/ScreenEngine.js

import React from "react";
import { useNavigation } from "./NavigationEngine";
import Screen from "../components/Screen";

/**
 * ScreenEngine
 * ---------------------------------------------------------
 * Renders the active screen based on the navigation stack.
 * - Reads current screen from NavigationEngine
 * - Passes params to the Screen component
 * - Handles missing screens safely
 */

export default function ScreenEngine({ screens }) {
  const navigation = useNavigation();
  const current = navigation.getCurrent();

  if (!current) {
    return (
      <div style={{ color: "red", padding: 20 }}>
        Error: No active screen found.
      </div>
    );
  }

  const { screen, params } = current;

  // Look up the screen definition
  const screenDef = screens?.[screen];

  if (!screenDef) {
    return (
      <div style={{ color: "red", padding: 20 }}>
        Error: Screen "{screen}" not found in registry.
      </div>
    );
  }

  return (
    <Screen
      name={screen}
      components={screenDef.components || []}
      params={params || {}}
    />
  );
}
