// frontend/src/components/Toolbar.jsx

/**
 * Toolbar.jsx
 * -----------
 * The action strip for the Blue Lotus editor.
 * Provides:
 *  - Mode switching (design / preview / inspect)
 *  - Tool selection (move / frame)
 *  - Panel toggles (layers / properties)
 *  - Command palette trigger
 */

import React from "react";

export function Toolbar({ engine }) {
    const { mode, activeTool } = engine.state;

    return (
        <div style={styles.row}>
            {/* Modes */}
            <ToolbarButton
                label="Design"
                active={mode === "design"}
                onClick={() => engine.setMode("design")}
            />
            <ToolbarButton
                label="Preview"
                active={mode === "preview"}
                onClick={() => engine.setMode("preview")}
            />
            <ToolbarButton
                label="Inspect"
                active={mode === "inspect"}
                onClick={() => engine.setMode("inspect")}
            />

            <div style={styles.divider} />

            {/* Tools */}
            <ToolbarButton
                label="Move"
                active={activeTool === "move"}
                onClick={() => engine.selectTool("move")}
            />
            <ToolbarButton
                label="Frame"
                active={activeTool === "frame"}
                onClick={() => engine.selectTool("frame")}
            />

            <div style={styles.divider} />

            {/* Panels */}
            <ToolbarButton
                label="Layers"
                onClick={() => engine.openPanel("layers")}
            />
            <ToolbarButton
                label="Properties"
                onClick={() => engine.openPanel("properties")}
            />
            <ToolbarButton
                label="Close Panel"
                onClick={() => engine.closePanel()}
            />

            <div style={styles.divider} />

            {/* Command Palette */}
            <ToolbarButton
                label="Commands"
                onClick={() => engine.toggleCommandPalette()}
            />
        </div>
    );
}

function ToolbarButton({ label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                ...styles.button,
                ...(active ? styles.buttonActive : {})
            }}
        >
            {label}
        </button>
    );
}

const styles = {
    row: {
        display: "flex",
        alignItems: "center",
        gap: "8px"
    },
    button: {
        background: "transparent",
        border: "1px solid #b37bff",
        color: "#e8e8f0",
        padding: "6px 12px",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "all 120ms ease"
    },
    buttonActive: {
        background: "#b37bff",
        color: "#000"
    },
    divider: {
        width: "1px",
        height: "24px",
        background: "rgba(255,255,255,0.1)",
        margin: "0 6px"
    }
};
