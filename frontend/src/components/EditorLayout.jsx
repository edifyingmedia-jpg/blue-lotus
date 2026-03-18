// frontend/src/components/EditorLayout.jsx

/**
 * EditorLayout.jsx
 * ----------------
 * High‑level layout wrapper for the Blue Lotus editor.
 * Provides:
 *  - Top navigation bar
 *  - Status strip
 *  - Toolbar mount
 *  - EditorSurface container
 */

import React from "react";
import { EditorSurface } from "./EditorSurface";
import { Toolbar } from "./Toolbar";

export function EditorLayout({ engine }) {
    return (
        <div style={styles.root}>
            {/* Top navigation */}
            <div style={styles.navbar}>
                <div style={styles.logo}>Blue Lotus</div>
                <div style={styles.status}>
                    {engine.state.commandPaletteOpen
                        ? "Command Palette Open"
                        : "Ready"}
                </div>
            </div>

            {/* Toolbar */}
            <div style={styles.toolbar}>
                <Toolbar engine={engine} />
            </div>

            {/* Main editor surface */}
            <div style={styles.surface}>
                <EditorSurface engine={engine} />
            </div>
        </div>
    );
}

const styles = {
    root: {
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#0b0b0d",
        color: "#e8e8f0",
        fontFamily: "Inter, sans-serif"
    },
    navbar: {
        height: "52px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        background: "#111118",
        borderBottom: "1px solid rgba(255,255,255,0.05)"
    },
    logo: {
        fontSize: "18px",
        fontWeight: "600",
        color: "#b37bff"
    },
    status: {
        fontSize: "14px",
        opacity: 0.7
    },
    toolbar: {
        height: "48px",
        background: "#16161f",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        alignItems: "center",
        padding: "0 12px"
    },
    surface: {
        flex: 1,
        display: "flex",
        overflow: "hidden"
    }
};
