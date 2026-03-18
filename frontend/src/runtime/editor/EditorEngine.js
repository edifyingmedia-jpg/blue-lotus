// frontend/src/runtime/editor/EditorEngine.js

/**
 * EditorEngine.js
 * ---------------
 * Core runtime logic engine for Blue Lotus.
 * Handles scene updates, additions, removals, and dispatches events
 * to the UI layer and other runtime systems.
 */

export class EditorEngine {
    constructor({ project, documentModel }) {
        this.project = project;
        this.documentModel = documentModel;
        this.listeners = {};
    }

    /**
     * Subscribe to engine events
     */
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    /**
     * Emit an event to all listeners
     */
    emit(event, payload) {
        const handlers = this.listeners[event];
        if (handlers) {
            handlers.forEach(fn => fn(payload));
        }
    }

    /**
     * Update a scene's content
     */
    updateScene(sceneId, updates) {
        const updatedModel = this.documentModel.updateScene(sceneId, updates);
        this.documentModel = updatedModel;

        const updatedScene = updatedModel.getSceneById(sceneId);
        this.emit("sceneUpdated", updatedScene);
    }

    /**
     * Add a new scene
     */
    addScene(scene) {
        const updatedModel = this.documentModel.addScene(scene);
        this.documentModel = updatedModel;

        const addedScene = updatedModel.getSceneById(scene.id);
        this.emit("sceneAdded", addedScene);
    }

    /**
     * Remove a scene
     */
    removeScene(sceneId) {
        const updatedModel = this.documentModel.removeScene(sceneId);
        this.documentModel = updatedModel;

        this.emit("sceneRemoved", sceneId);
    }

    /**
     * Get the current document model
     */
    getDocumentModel() {
        return this.documentModel;
    }
}
