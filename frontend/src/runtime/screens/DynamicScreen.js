/**
 * DynamicScreen.js
 * ----------------------------------------------------
 * Renders a screen definition dynamically using the
 * ScreenRenderer and the component resolution pipeline.
 *
 * This is the core runtime screen wrapper used by both
 * Preview mode and deployed apps.
 */

import React from "react";
import ScreenRenderer from "../ScreenRenderer";
import useNavigation from "../useNavigation";
import useRuntimeDataBindings from "../useRuntimeDataBindings";

export default function DynamicScreen({ screen }) {
  const { currentScreen } = useNavigation();

  // If no screen is passed, fall back to current screen
  const active = screen || currentScreen;
  if (!active) return null;

  // Bindings for the root screen node
  const bindings = useRuntimeDataBindings(active.id, active.props || {});

  return (
    <ScreenRenderer
      screen={active}
      bindings={bindings}
    />
  );
}
