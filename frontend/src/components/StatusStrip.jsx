// frontend/src/components/StatusStrip.jsx

/**
 * StatusStrip.jsx
 * ----------------
 * A subtle cinematic status bar that reflects:
 *  - current mode
 *  - save state
 *  - command palette hint
 *  - engine activity
 */

import React from "react";

export function StatusStrip({ engine }) {
    const { mode, isSaving, commandPaletteOpen } = engine.state;

    return (
        <div style={styles.container}>
            {/* Left: Mode */}
            <div style={styles.section}>
                <span style={styles.label}>Mode:</span>
                <span style={styles.value}>{mode}</span>
            </div>

            {/* Center: Save state */}
            <div style={styles.section}>
                {isSaving ? (
                    <span style={styles.saving}>Saving…</span>
                ) : (
                    <span style={styles.saved}>All changes saved</span>
                )}
            </div>

            {/* Right: Command palette hint */}
            <div style={styles.section}>
                {commandPaletteOpen ? (
                    <span style={styles.hint}>Palette open</span>
                ) : (
                    <span style={styles.hint}>Press ⌘K for commands</span>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        height: "32px",
        background: "#111118",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 14px",
        fontSize: "13px",
        color: "#9a9ab3",
        fontFamily: "Inter, sans-serif"
    },
    section: {
        display: "flex",
        alignItems: "center",
        gap: "6px"
    },
    label: {
        opacity: 0.6
    },
    value: {
        color: "#b37bff",
        fontWeight: 500
    },
    saving: {
        color: "#ff6ad5"
    },
    saved: {
        color: "#3dfdff"
    },
    hint: {
        opacity: 0.7
    }
};
