// frontend/src/Builder/components/Toolbar/Toolbar.js

/**
 * Toolbar.js
 * ---------------------------------------------------------
 * The Builder's top toolbar.
 *
 * Responsibilities:
 *  - Render toolbar action buttons
 *  - Provide a clean, consistent layout
 *  - Contain no business logic
 */

import React from 'react';
import ExportButton from './ExportButton';
import './Toolbar.css'; // Only if you have a CSS file; safe to remove if not present

export default function Toolbar() {
  return (
    <div className="toolbar-container">
      <ExportButton />
      {/* Future toolbar buttons go here */}
    </div>
  );
}
