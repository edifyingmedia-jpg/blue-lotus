import React from "react";

export default function Sidebar() {
  return (
    <div className="builder-sidebar">
      <div className="sidebar-section">
        <h3>Screens</h3>
        <button data-panel="screens">Open Screen Editor</button>
      </div>

      <div className="sidebar-section">
        <h3>Components</h3>
        <button data-panel="components">Open Component Editor</button>
      </div>

      <div className="sidebar-section">
        <h3>Navigation</h3>
        <button data-panel="navigation">Open Navigation Editor</button>
      </div>

      <div className="sidebar-section">
        <h3>Preview</h3>
        <button data-panel="preview">Open Preview</button>
      </div>
    </div>
  );
}
