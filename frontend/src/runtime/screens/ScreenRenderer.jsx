// frontend/src/runtime/screens/ScreenRenderer.jsx

/**
 * ScreenRenderer.jsx
 * ---------------------------------------------------------
 * JSX wrapper for rendering a resolved runtime screen.
 *
 * This component is intentionally thin.
 * All logic lives in ScreenRenderer.js.
 */

import React from 'react';
import ScreenRenderer from './ScreenRenderer';

export default function ScreenRendererJSX({ screen }) {
  if (!screen) return null;

  return <ScreenRenderer screen={screen} />;
}
