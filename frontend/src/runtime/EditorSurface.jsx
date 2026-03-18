// frontend/src/runtime/EditorSurface.jsx

/**
 * EditorSurface.jsx
 * -----------------
 * The main workspace canvas where the active scene is displayed.
 * This will eventually support:
 *   - text editing
 *   - component rendering
 *   - drag/drop
 *   - selection
 *   - AI-assisted generation
 */

import React from "react";

export function EditorSurface({ engine }) {
    const scene = engine.getActiveScene();

    if (!scene) {
        return (
            <div style={styles.empty}>
                No scene selected.
            </div>
        );
    }

    return (
        <div style={styles.surface}>
            <textarea
                style={styles.textarea}
                value={scene.content}
                onChange={(e) =>
                    engine.updateSceneContent(scene.id, e.target.value)
                }
            />
        </div>
    );
}

const styles = {
    surface: {
        width: "100%",
        height: "100%",
        padding: "24px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        background: "#0f0f12",
        overflow: "auto"
    },
    textarea: {
        width: "100%",
        height: "100%",
        background: "#141418",
        color: "#e8e8f0",
        border: "1px solid #1d1d22",
        borderRadius: "6px",
        padding: "16px",
        fontSize: "16px",
        lineHeight: "1.6",
        resize: "none",
        outline: "none",
        fontFamily: "Inter, sans-serif"
    },
    empty: {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#777",
        fontSize: "18px"
    }
};
