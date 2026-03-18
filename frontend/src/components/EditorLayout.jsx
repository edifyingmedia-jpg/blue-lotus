// frontend/src/components/EditorLayout.jsx

/**
 * EditorLayout.jsx
 * ----------------
 * The main UI layout for the Blue Lotus editor.
 * Assembles:
 *  - Toolbar
 *  - SceneList
 *  - SceneEditor
 *  - CommandPalette
 *
 * Connects UI actions to the EditorEngine and DocumentModel.
 */

import React, { useState, useEffect } from "react";
import { Toolbar } from "./Toolbar";
import { SceneList } from "./SceneList";
import { SceneEditor } from "./SceneEditor";
import { CommandPalette } from "./CommandPalette";

export function EditorLayout({ engine }) {
    const [documentModel, setDocumentModel] = useState(engine.getDocumentModel());
    const [activeSceneId, setActiveSceneId] = useState(
        documentModel.getScenes()[0]?.id || null
    );
    const [isPaletteOpen, setPaletteOpen] = useState(false);

    // Sync with engine updates
    useEffect(() => {
        engine.on("sceneUpdated", () => {
            setDocumentModel(engine.getDocumentModel());
        });

        engine.on("sceneAdded", () => {
            setDocumentModel(engine.getDocumentModel());
        });

        engine.on("sceneRemoved", () => {
            setDocumentModel(engine.getDocumentModel());
        });
    }, [engine]);

    const scenes = documentModel.getScenes();
    const activeScene = activeSceneId
        ? documentModel.getSceneById(activeSceneId)
        : null;

    // Command palette commands
    const commands = [
        {
            id: "add-scene",
            name: "Add Scene",
            action: () => handleAddScene()
        },
        {
            id: "delete-scene",
            name: "Delete Scene",
            action: () => activeScene && handleDeleteScene(activeScene.id)
        },
        {
            id: "rename-scene",
            name: "Rename Scene",
            action: () =>
                activeScene &&
                handleRenameScene(activeScene.id, prompt("New name:"))
        }
    ];

    // UI → Engine actions
    const handleAddScene = () => {
        const newScene = {
            id: crypto.randomUUID(),
            title: "New Scene",
            content: "",
            order: scenes.length
        };
        engine.addScene(newScene);
        setActiveSceneId(newScene.id);
    };

    const handleDeleteScene = (id) => {
        engine.removeScene(id);
        const remaining = engine.getDocumentModel().getScenes();
        setActiveSceneId(remaining[0]?.id || null);
    };

    const handleRenameScene = (id, newName) => {
        if (!newName) return;
        engine.updateScene(id, { title: newName });
    };

    const handleSceneContentChange = (newContent) => {
        if (!activeScene) return;
        engine.updateScene(activeScene.id, { content: newContent });
    };

    return (
        <div style={styles.container}>
            <Toolbar
                activeScene={activeScene}
                onAddScene={handleAddScene}
                onDeleteScene={handleDeleteScene}
                onRenameScene={handleRenameScene}
                onOpenCommandPalette={() => setPaletteOpen(true)}
            />

            <div style={styles.body}>
                <SceneList
                    scenes={scenes}
                    activeSceneId={activeSceneId}
                    onSelect={setActiveSceneId}
                />

                <SceneEditor
                    scene={activeScene}
                    onChange={handleSceneContentChange}
                />
            </div>

            <CommandPalette
                isOpen={isPaletteOpen}
                commands={commands}
                onClose={() => setPaletteOpen(false)}
            />
        </div>
    );
}

const styles = {
    container: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0d0d0f"
    },
    body: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        overflow: "hidden"
    }
};
