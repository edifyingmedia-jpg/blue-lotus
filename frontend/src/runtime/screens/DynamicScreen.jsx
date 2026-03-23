// frontend/src/runtime/screens/DynamicScreen.jsx

/**
 * DynamicScreen.jsx
 * ---------------------------------------------------------
 * JSX wrapper for rendering a resolved runtime screen.
 *
 * This component assumes the screen has already been
 * loaded and validated by the runtime engine layer.
 */

import React from 'react';
import ScreenRenderer from './ScreenRenderer';

export default function DynamicScreen({ screen }) {
  if (!screen) return null;

  return <ScreenRenderer screen={screen} />;
}
