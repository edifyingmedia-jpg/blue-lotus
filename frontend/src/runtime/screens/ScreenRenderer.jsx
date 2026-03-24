/**
 * ScreenRenderer.jsx
 * ----------------------------------------------------
 * JSX wrapper for ScreenRenderer.js.
 *
 * This file exists because some components and render
 * paths require JSX resolution separate from the logic
 * layer in ScreenRenderer.js.
 *
 * This ensures:
 * - clean separation of logic vs. JSX
 * - no circular imports
 * - compatibility with React tooling
 */

import React from "react";
import ScreenRenderer from "./ScreenRenderer";

export default function ScreenRendererJSX(props) {
  return <ScreenRenderer {...props} />;
}
