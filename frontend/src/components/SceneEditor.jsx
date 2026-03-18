// frontend/src/components/SceneEditor.jsx

/**
 * SceneEditor.jsx
 * ---------------
 * A real, functional scene editor panel.
 * Displays the active scene's content and emits edits upward.
 *
 * This component is designed to replace the raw textarea
 * inside EditorSurface once the full UI is integrated.
 */

import React, { useEffect, useState } from "react";

export function SceneEditor({ scene, onChange }) {
    const [value, setValue] = useState(scene?.content || "");

    // Sync when the active scene changes
    useEffect(() => {
        setValue(scene?.content || "");
    }, [scene?.id]);

    const handleInput = (e) => {
        const newValue = e.target.value;
        setValue(newValue);
        onChange(newValue);
    };

    return (
        <div style={styles.container}>
            <textarea
                style={styles.textarea}
                value={value}
                onChange={handleInput}
            />
        </div>
    );
}

const styles = {
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#0d0d0f",
        padding: "0"
    },
    textarea: {
        flex: 1,
        width: "100%",
        height: "100%",
        padding: "16px",
        fontSize: "16px",
        lineHeight: "1.6",
        border: "none",
        outline: "none",
        resize: "none",
        background: "#0d0d0f",
        color: "#e8e8f0",
        fontFamily: "monospace"
    }
};
