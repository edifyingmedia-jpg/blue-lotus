// frontend/src/runtime/screens/ScreenRenderer.js

/**
 * ScreenRenderer.js
 * ---------------------------------------------------------
 * Renders a normalized runtime screen definition.
 *
 * Responsibilities:
 *  - Receive a resolved screen object
 *  - Render its layout and component tree
 *
 * This renderer must remain deterministic and UI‑agnostic.
 */

import React from 'react';
import ComponentResolver from '../resolver/ComponentResolver';

export default function ScreenRenderer({ screen }) {
  if (!screen) return null;

  const { components } = screen;

  return (
    <>
      {components.map((node, index) => (
        <ComponentResolver key={index} node={node} />
      ))}
    </>
  );
}
