// frontend/src/components/EditorLayout.jsx

/**
 * EditorLayout.jsx
 * ---------------------------------------------------------
 * Cinematic UI shell of the Blue Lotus editor.
 * Wraps:
 *  - Toolbar (passed from parent)
 *  - SceneList + SceneEditor (inside children)
 *  - StatusStrip (footer)
 *
 * Provides:
 *  - Neon-ready class hooks
 *  - Responsive layout
 *  - Future-proof panel structure
 */

import React from "react";
import "./EditorLayout.css";

export default function EditorLayout({ children }) {
    return (
        <div className="editor-layout-root">

            {/* Top bar */}
            <header className="editor-topbar">
                <div className="editor-logo">Blue Lotus</div>
            </header>

            {/* Body: sidebars + workspace */}
            <div className="editor-body">
                {children}
            </div>
        </div>
    );
}
