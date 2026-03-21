// frontend/src/Builder/components/Toolbar/Toolbar.js

/**
 * Toolbar
 * ---------------------------------------------------------
 * Main Builder toolbar container.
 * Renders all toolbar actions, including Export.
 */

import React from "react";
import { ExportButton } from "./ExportButton";

export function Toolbar({ builderState }) {
  return (
    <div className="builder-toolbar">
      {/* Left side actions */}
      <div className="toolbar-group left">
        {/* Future: screen actions, undo/redo, etc. */}
      </div>

      {/* Center actions */}
      <div className="toolbar-group center">
        {/* Future: AI actions, search, etc. */}
      </div>

      {/* Right side actions */}
      <div className="toolbar-group right">
        <ExportButton builderState={builderState} />
      </div>
    </div>
  );
}
