// frontend/src/components/EditorApp.jsx

/**
 * EditorApp.jsx
 * -------------
 * The top-level component that boots the entire Blue Lotus editor.
 * - Loads the project via ProjectLoader
 * - Creates the EditorEngine
 * - Renders EditorLayout once ready
 */

import React, { useEffect, useState } from "react";
import { ProjectLoader } from "../runtime/editor/ProjectLoader";
import { EditorLayout } from "./EditorLayout";

export function EditorApp({ projectId }) {
    const [engine, setEngine] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loader = new ProjectLoader({
            projectId,
            onReady: ({ engine }) => {
                setEngine(engine);
            },
            onError: (err) => {
                console.error("Editor failed to load:", err);
                setError(err);
            }
        });

        loader.load();
    }, [projectId]);

    if (error) {
        return (
            <div style={styles.error}>
                <h2>Failed to load project</h2>
                <p>{error.message}</p>
            </div>
        );
    }

    if (!engine) {
        return (
            <div style={styles.loading}>
                <div style={styles.spinner} />
                <p>Loading editor…</p>
            </div>
        );
    }

    return <EditorLayout engine={engine} />;
}

const styles = {
    loading: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0d0d0f",
        color: "#e8e8f0",
        fontSize: "18px"
    },
    spinner: {
        width: "40px",
        height: "40px",
        border: "4px solid #333",
        borderTop: "4px solid #e8e8f0",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        marginBottom: "12px"
    },
    error: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#1a0000",
        color: "#ffcccc",
        fontSize: "18px"
    }
};
