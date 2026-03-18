// frontend/src/runtime/document/DocumentModel.js

/**
 * DocumentModel.js
 * ----------------
 * The core runtime document structure for Blue Lotus.
 * Represents the project, its scenes, and provides safe,
 * immutable access patterns for the editor engine.
 */

export function createDocumentModel({ project, scenes }) {
    return new DocumentModel(project, scenes);
}

export class DocumentModel {
    constructor(project, scenes) {
        this.project = project;
        this.scenes = normalizeScenes(scenes);
        this.sceneIndex = buildSceneIndex(this.scenes);
    }

    /**
     * Get project metadata
     */
    getProject() {
        return this.project;
    }

    /**
     * Get all scenes in order
     */
    getScenes() {
        return this.scenes;
    }

    /**
     * Get a scene by ID
     */
    getSceneById(id) {
        return this.sceneIndex[id] || null;
    }

    /**
     * Update a scene's content (immutable update)
     */
    updateScene(id, updates) {
        if (!this.sceneIndex[id]) return;

        const updatedScenes = this.scenes.map(scene =>
            scene.id === id ? { ...scene, ...updates } : scene
        );

        return new DocumentModel(this.project, updatedScenes);
    }

    /**
     * Add a new scene
     */
    addScene(scene) {
        const updatedScenes = [...this.scenes, normalizeScene(scene)];
        return new DocumentModel(this.project, updatedScenes);
    }

    /**
     * Remove a scene
     */
    removeScene(id) {
        const updatedScenes = this.scenes.filter(scene => scene.id !== id);
        return new DocumentModel(this.project, updatedScenes);
    }
}

/**
 * Normalize all scenes
 */
function normalizeScenes(scenes) {
    return scenes.map(normalizeScene);
}

/**
 * Normalize a single scene
 */
function normalizeScene(scene) {
    return {
        id: scene.id,
        title: scene.title || "Untitled Scene",
        content: scene.content || "",
        order: scene.order ?? 0,
        ...scene
    };
}

/**
 * Build a fast lookup index
 */
function buildSceneIndex(scenes) {
    const index = {};
    for (const scene of scenes) {
        index[scene.id] = scene;
    }
    return index;
}
