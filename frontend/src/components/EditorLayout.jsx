// frontend/src/components/EditorLayout.jsx

/**
 * EditorLayout.jsx
 * ---------------------------------------------------------
 * The cinematic UI shell of the Blue Lotus editor.
 * Wraps:
 *  - Top bar
 *  - Left + right side panels
 *  - EditorSurface (workspace)
 *  - StatusStrip (footer)
 *
 * Provides:
 *  - Neon-ready class hooks
 *  - Responsive layout
 *  - Emotionally intelligent spacing
 *  - Future-proof panel structure
 */

import React from "react";
import { StatusStrip } from "./StatusStrip";
import { EditorSurface } from "../runtime/EditorSurface";
import "./EditorLayout.css";

export function EditorLayout({ engine }) {
    return (
        <div className="editor-layout-root">

            {/* Top bar */}
            <header className="editor-topbar">
                <div className="editor-logo">Blue Lotus</div>
                <div className="editor-mode">
                    {engine.state.mode.toUpperCase()}
                </div>
            </header>

            {/* Body: sidebars + workspace */}
            <div className="editor-body">

                {/* Left sidebar */}
                <aside className="editor-sidebar-left">
                    {/* Future: Scene list, project tree, assets */}
                </aside>

                {/* Workspace */}
                <main className="editor-workspace">
                    <EditorSurface engine={engine} />
                </main>

                {/* Right sidebar */}
                <aside className="editor-sidebar-right">
                    {/* Future: Inspector, properties, AI panel */}
                </aside>
            </div>

            {/* Footer */}
            <footer className="editor-footer">
                <StatusStrip engine={engine} />
            </footer>
        </div>
    );
}
