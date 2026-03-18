// frontend/src/engine/Engine.js

/**
 * Engine.js
 * ---------
 * The core runtime of the Blue Lotus editor.
 * Manages:
 *   - state
 *   - scenes
 *   - active scene
 *   - modes
 *   - saving
 *   - command registry
 *   - event bridge
 */

import { createCommandRegistry } from "./EngineCommands";
import { EngineEventBridge } from "./EngineEventBridge";

export class Engine {
    constructor() {
        this.state = {
            scenes: [],
            activeSceneId: null,
            mode: "design",
            dirty: false,
            isSaving: false,
            commandPaletteOpen: false
        };

        this.commands = createCommandRegistry(this);
        this.events = new EngineEventBridge(this);
    }

    // -----------------------------
    // Initialization
    // -----------------------------
    init() {
        this.events.bind();
        this.createScene(); // start with one scene
    }

    // -----------------------------
    // Scene Management
    // -----------------------------
    createScene() {
        const id = crypto.randomUUID();
        const newScene = {
            id,
            title: `Scene ${this.state.scenes.length + 1}`,
            content: ""
        };

        this.state.scenes.push(newScene);
        this.state.activeSceneId = id;
        this.markDirty();
    }

    deleteActiveScene() {
        if (!this.state.activeSceneId) return;

        this.state.scenes = this.state.scenes.filter(
            s => s.id !== this.state.activeSceneId
        );

        if (this.state.scenes.length > 0) {
            this.state.activeSceneId = this.state.scenes[0].id;
        } else {
            this.state.activeSceneId = null;
        }

        this.markDirty();
    }

    duplicateActiveScene() {
        const scene = this.getActiveScene();
        if (!scene) return;

        const id = crypto.randomUUID();
        const copy = {
            id,
            title: scene.title + " (Copy)",
            content: scene.content
        };

        this.state.scenes.push(copy);
        this.state.activeSceneId = id;
        this.markDirty();
    }

    getActiveScene() {
        return this.state.scenes.find(s => s.id === this.state.activeSceneId);
    }

    setActiveScene(id) {
        this.state.activeSceneId = id;
    }

    updateSceneContent(id, content) {
        const scene = this.state.scenes.find(s => s.id === id);
        if (!scene) return;

        scene.content = content;
        this.markDirty();
    }

    // -----------------------------
    // Modes
    // -----------------------------
    setMode(mode) {
        this.state.mode = mode;
    }

    // -----------------------------
    // Commands
    // -----------------------------
    getCommands() {
        return this.commands;
    }

    runCommand(id) {
        const cmd = this.commands.find(c => c.id === id);
        if (cmd) cmd.action();
    }

    // -----------------------------
    // Command Palette
    // -----------------------------
    toggleCommandPalette() {
        this.state.commandPaletteOpen = !this.state.commandPaletteOpen;
    }

    closeCommandPalette() {
        this.state.commandPaletteOpen = false;
    }

    // -----------------------------
    // Saving
    // -----------------------------
    markDirty() {
        this.state.dirty = true;
    }

    async save() {
        if (this.state.isSaving) return;

        this.state.isSaving = true;

        // Simulated save delay
        await new Promise(res => setTimeout(res, 300));

        this.state.dirty = false;
        this.state.isSaving = false;
    }
}
