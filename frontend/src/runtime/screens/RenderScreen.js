/**
 * RenderScreen.js
 * ----------------------------------------------------
 * Renders a screen object using the ScreenRenderer.
 *
 * This is the stable, modern replacement for the old
 * RenderScreen.js that existed before the new runtime
 * pipeline (DynamicScreen → RenderScreen → ScreenRenderer).
 *
 * This file:
 * - Accepts a full screen definition
 * - Resolves bindings for the root node
 * - Passes everything to ScreenRenderer
 */

import React from "react";
import ScreenRenderer from "../ScreenRenderer";
import useRuntimeDataBindings from "../useRuntimeDataBindings";

export default function RenderScreen({ screen }) {
  if (!screen) return null;

  // Bindings for the root screen node
  const bindings = useRuntimeDataBindings(screen.id, screen.props || {});

  return (
    <ScreenRenderer
      screen={screen}
      bindings={bindings}
    />
  );
}
