// frontend/src/components/SceneEditor.jsx

/**
 * SceneEditor.jsx
 * ---------------------------------------------------------
 * Cinematic writing surface for the Blue Lotus editor.
 * Syncs with the active scene and emits edits upward.
 * Future-ready for:
 *  - inline AI tools
 *  - syntax highlighting
 *  - minimap
 *  - formatting controls
 */

import React, { useEffect, useState } from "react";
import "./SceneEditor.css";

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
        <section className="scene-editor-root">
            <textarea
                className="scene-editor-textarea"
                value={value}
                onChange={handleInput}
                spellCheck={false}
            />
        </section>
    );
}
