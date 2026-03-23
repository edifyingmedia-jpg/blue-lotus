// frontend/src/runtime/screens/ScreenRenderer.jsx

/**
 * ScreenRenderer.jsx
 * ---------------------------------------------------------
 * JSX wrapper for rendering a resolved runtime screen.
 *
 * This component assumes:
 *  - The screen has already been loaded
 *  - The screen has already been normalized
 *  - Rendering is purely declarative
 */

import React from 'react';
import ScreenRenderer from './ScreenRenderer';

export default function ScreenRendererJSX({ screen }) {
  if (!screen) return null;

  return <ScreenRenderer screen={screen} />;
}
