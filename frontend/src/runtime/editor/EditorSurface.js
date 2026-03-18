// frontend/src/runtime/editor/EditorSurface.js

/**
 * EditorSurface.js
 * ----------------
 * The UI-facing runtime surface for Blue Lotus.
 * This class mounts a textarea into the DOM, listens for engine events,
 * and emits user edits back to the engine.
 *
 * This is NOT a React component — it is a runtime surface that
 * EditorBootstrap controls.
 */

export class EditorSurface {
    constructor({ engine, documentModel }) {
        this.engine = engine;
        this.documentModel = documentModel;

        // Root DOM element for the editor
        this.root = null;

        // Active scene ID (default: first scene)
        const scenes = documentModel.getScenes();
        this.activeSceneId = scenes.length > 0 ? scenes[0].id : null;
    }

    /**
     * Mount the editor surface into the DOM
     */
    mount() {
        // Create root container
        this.root = document.createElement("div");
        this.root.setAttribute("data-editor-surface", "true");
        this.root.style.width = "100%";
        this.root.style.height = "100%";
        this.root.style.display = "flex";
        this.root.style.flexDirection = "column";

        // Create textarea
        this.textarea = document.createElement("textarea");
        this.textarea.style.flex = "1";
        this.textarea.style.width = "100%";
        this.textarea.style.height = "100%";
        this.textarea.style.padding = "16px";
        this.textarea.style.fontSize = "16px";
        this.textarea.style.lineHeight = "1.6";
        this.textarea.style.border = "none";
        this.textarea.style.outline = "none";
        this.textarea.style.resize = "none";
        this.textarea.style.background = "#0d0d0f";
        this.textarea.style.color = "#e8e8f0";
        this.textarea.style.fontFamily = "monospace";

        // Load initial content
        this._loadActiveSceneContent();

        // Listen for user edits
        this.textarea.addEventListener("input", () => {
            this.engine.updateScene(this.activeSceneId, {
                content: this.textarea.value
            });
        });

        // Append to DOM
        document.body.appendChild(this.root);
        this.root.appendChild(this.textarea);
    }

    /**
     * Load the active scene's content into the textarea
     */
    _loadActiveSceneContent() {
        if (!this.activeSceneId) return;

        const scene = this.documentModel.getSceneById(this.activeSceneId);
        if (scene) {
            this.textarea.value = scene.content || "";
        }
    }

    /**
     * Engine → UI: Scene updated
     */
    updateScene(scene) {
        if (scene.id === this.activeSceneId) {
            this.textarea.value = scene.content || "";
        }
    }

    /**
     * Engine → UI: Scene added
     */
    addScene(scene) {
        // If this is the first scene, activate it
        if (!this.activeSceneId) {
            this.activeSceneId = scene.id;
            this._loadActiveSceneContent();
        }
    }

    /**
     * Engine → UI: Scene removed
     */
    removeScene(sceneId) {
        if (sceneId === this.activeSceneId) {
            const scenes = this.documentModel.getScenes();
            this.activeSceneId = scenes.length > 0 ? scenes[0].id : null;
            this._loadActiveSceneContent();
        }
    }
}
