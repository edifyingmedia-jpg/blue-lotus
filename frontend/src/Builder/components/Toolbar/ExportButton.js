// frontend/src/Builder/components/Toolbar/ExportButton.js

/**
 * ExportButton.js
 * ---------------------------------------------------------
 * Triggers the Builder's export pipeline.
 *
 * Responsibilities:
 *  - Call builderEngine.exportProject()
 *  - Provide a clean UI button in the toolbar
 *  - No logic beyond triggering the export action
 */

import React, { useContext } from 'react';
import { BuilderContext } from '../../../BuilderContext';

export default function ExportButton() {
  const { builderEngine } = useContext(BuilderContext);

  const handleExport = () => {
    builderEngine.exportProject();
  };

  return (
    <button className="toolbar-button" onClick={handleExport}>
      Export
    </button>
  );
}
