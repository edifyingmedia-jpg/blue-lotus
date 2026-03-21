// frontend/src/Builder/layout/BuilderLayout.js

/**
 * BuilderLayout
 * ---------------------------------------------------------
 * Defines the structural layout of the Builder UI:
 * - Toolbar (top)
 * - Sidebar panels (left/right)
 * - Canvas (center)
 */

import React from "react";
import { Toolbar } from "../components/Toolbar";

export function BuilderLayout({ builderState, children }) {
  return (
    <div className="builder-layout">
      <Toolbar builderState={builderState} />

      <div className="builder-body">
        {/* Left sidebar (screens, components, etc.) */}
        <div className="builder-sidebar-left">
          {/* Future: ScreenList, ComponentTree */}
        </div>

        {/* Main canvas area */}
        <div className="builder-canvas">
          {children}
        </div>

        {/* Right sidebar (inspector, properties, etc.) */}
        <div className="builder-sidebar-right">
          {/* Future: Inspector */}
        </div>
      </div>
    </div>
  );
}
