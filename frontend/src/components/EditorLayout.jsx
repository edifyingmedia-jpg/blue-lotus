// frontend/src/components/EditorLayout.jsx

/**
 * EditorLayout.jsx
 * ----------------
 * The main UI shell of the Blue Lotus editor.
 * Wraps the top bar, side panels, workspace, and status strip.
 */

import React from "react";
import { StatusStrip } from "./StatusStrip";
import { EditorSurface } from "../runtime/EditorSurface";

export function EditorLayout({ engine }) {
    return (
        <div style={styles.container}>
            <div style={styles.topBar}>
                <div style={styles.logo}>Blue Lotus</div>
                <div style={styles.mode}>{engine.state.mode.toUpperCase()}</div>
            </div>

            <div style={styles.body}>
                <div style={styles.sidebarLeft}>
                    {/* Future: Scene list, project tree, assets */}
                </div>

                <div style={styles.workspace}>
                    <EditorSurface engine={engine} />
                </div>

                <div style={styles.sidebarRight}>
                    {/* Future: Inspector, properties, AI panel */}
                </div>
            </div>

            <StatusStrip engine={engine} />
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        background: "#0b0b0d",
        color: "#e8e8f0",
        overflow: "hidden"
    },
    topBar: {
        height: "48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        background: "#111114",
        borderBottom: "1px solid #1d1d22"
    },
    logo: {
        fontSize: "18px",
        fontWeight: "600",
        letterSpacing: "0.5px"
    },
    mode: {
        fontSize: "14px",
        opacity: 0.7
    },
    body: {
        flex: 1,
        display: "flex",
        flexDirection: "row"
    },
    sidebarLeft: {
        width: "220px",
        background: "#111114",
        borderRight: "1px solid #1d1d22"
    },
    workspace: {
        flex: 1,
        background: "#0f0f12",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    sidebarRight: {
        width: "260px",
        background: "#111114",
        borderLeft: "1px solid #1d1d22"
    }
};
