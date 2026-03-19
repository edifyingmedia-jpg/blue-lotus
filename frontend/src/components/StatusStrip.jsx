/**
 * StatusStrip.jsx
 * ---------------------------------------------------------
 * Cinematic status bar for the Blue Lotus editor.
 * Reflects:
 *  - current mode
 *  - save state
 *  - command palette state
 *  - engine activity (future-ready)
 */

import React from "react";
import "./StatusStrip.css";

export default function StatusStrip({ state }) {
    const mode = state?.mode || "edit";
    const isSaving = state?.isSaving || false;
    const commandPaletteOpen = state?.commandPaletteOpen || false;

    return (
        <footer className="status-root">

            {/* Left: Mode */}
            <div className="status-section">
                <span className="status-label">Mode:</span>
                <span className="status-value">{mode}</span>
            </div>

            {/* Center: Save state */}
            <div className="status-section">
                {isSaving ? (
                    <span className="status-saving">Saving…</span>
                ) : (
                    <span className="status-saved">All changes saved</span>
                )}
            </div>

            {/* Right: Command palette hint */}
            <div className="status-section">
                {commandPaletteOpen ? (
                    <span className="status-hint status-hint-active">
                        Palette open
                    </span>
                ) : (
                    <span className="status-hint">Press ⌘K for commands</span>
                )}
            </div>

        </footer>
    );
}
