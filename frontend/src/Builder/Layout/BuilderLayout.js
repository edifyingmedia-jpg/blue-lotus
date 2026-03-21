// frontend/src/Builder/Layout/BuilderLayout.js

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
import { ScreenList } from "../components/ScreenList";

export function BuilderLayout({ builderState, onSelectScreen, children }) {
  return (
    <div className="builder-layout">
      <Toolbar builderState={builderState} />

      <div className="builder-body">
        {/* Left sidebar */}
        <div className="builder-sidebar-left">
          <ScreenList
            builderState={builderState}
            onSelectScreen={onSelectScreen}
          />
        </div>

        {/* Main canvas area */}
        <div className="builder-canvas">
          {children}
        </div>

        {/* Right sidebar */}
        <div className="builder-sidebar-right">
          {/* Future: Inspector */}
        </div>
      </div>
    </div>
  );
}
