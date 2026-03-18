// frontend/src/runtime/DocumentModel.js

/**
 * DocumentModel.js
 * ----------------
 * Defines the core data structures for Blue Lotus:
 *   - Project
 *   - Scenes
 *   - Scene content
 *   - Metadata
 *
 * This is the canonical source of truth for how editor data is shaped.
 */

export class Scene {
    constructor(id, name, content = "") {
        this.id = id;
        this.name = name;
        this.content = content;
        this.createdAt = Date.now();
        this.updatedAt = Date.now();
    }
}

export class Project {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.createdAt = Date.now();
        this.updatedAt = Date.now();

        /** @type {Scene[]} */
        this.scenes = [];

        // Future: project-level metadata
        this.metadata = {
            theme: "default",
            author: "Unknown",
            version: 1
        };
    }

    addScene(name) {
        const id = crypto.randomUUID();
        const scene = new Scene(id, name);
        this.scenes.push(scene);
        this.updatedAt = Date.now();
        return scene;
    }

    getScene(id) {
        return this.scenes.find((s) => s.id === id) || null;
    }

    updateSceneContent(id, content) {
        const scene = this.getScene(id);
        if (!scene) return;

        scene.content = content;
        scene.updatedAt = Date.now();
        this.updatedAt = Date.now();
    }

    renameScene(id, newName) {
        const scene = this.getScene(id);
        if (!scene) return;

        scene.name = newName;
        scene.updatedAt = Date.now();
        this.updatedAt = Date.now();
    }
}
