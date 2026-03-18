// frontend/src/components/Toolbar.jsx

/**
 * Toolbar.jsx
 * ---------------------------------------------------------
 * The cinematic top toolbar for the Blue Lotus editor.
 * Provides:
 *  - Neon-ready class hooks
 *  - Icon buttons
 *  - Mode indicator
 *  - Future AI actions
 */

import React from "react";
import "./Toolbar.css";

export function Toolbar({ engine }) {
    const { mode } = engine.state;

    return (
        <div className="toolbar-root">
            {/* Left cluster */}
            <div className="toolbar-group">
                <button
                    className="toolbar-btn"
                    onClick={() => engine.createScene()}
                >
                    + Scene
                </button>

                <button
                    className="toolbar-btn"
                    onClick={() => engine.saveProject()}
                >
                    Save
                </button>
            </div>

            {/* Center title */}
            <div className="toolbar-title">
                {engine.projectName || "Untitled Project"}
            </div>

            {/* Right cluster */}
            <div className="toolbar-group">
                <button
                    className="toolbar-btn"
                    onClick={() => engine.toggleCommandPalette()}
                >
                    Commands
                </button>

                <div className="toolbar-mode">
                    {mode.toUpperCase()}
                </div>
            </div>
        </div>
    );
}
