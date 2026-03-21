// frontend/src/Builder/Builder.js

/**
 * Builder
 * ---------------------------------------------------------
 * Main Builder container.
 * Renders the toolbar and the rest of the Builder UI.
 */

import React from "react";
import { Toolbar } from "./components/Toolbar";

export function Builder({ builderState }) {
  return (
    <div className="builder-root">
      <Toolbar builderState={builderState} />

      <div className="builder-content">
        {/* Future: Canvas, Inspector, Screens, Components, etc. */}
      </div>
    </div>
  );
}
