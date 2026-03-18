// frontend/src/App.jsx

/**
 * App.jsx
 * -------
 * Root of the Blue Lotus editor.
 * Initializes the engine and mounts the full editor layout.
 */

import React from "react";
import { useEngine } from "./engine";
import { EditorLayout } from "./components/EditorLayout";

export default function App() {
    const engine = useEngine();

    return (
        <div style={styles.app}>
            <EditorLayout engine={engine} />
        </div>
    );
}

const styles = {
    app: {
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#0b0b0d",
        color: "#e8e8f0",
        fontFamily: "Inter, sans-serif"
    }
};
