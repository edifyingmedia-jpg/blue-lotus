// frontend/src/engine/EngineEventBridge.js

/**
 * EngineEventBridge.js
 * --------------------
 * Centralized event wiring between UI components and the engine.
 * Prevents scattered listeners and keeps the engine deterministic.
 */

export class EngineEventBridge {
    constructor(engine) {
        this.engine = engine;
        this.bound = false;
    }

    bind() {
        if (this.bound) return;
        this.bound = true;

        // Keyboard shortcuts
        window.addEventListener("keydown", this.handleKeyDown);

        // Auto-save loop
        this.saveInterval = setInterval(() => {
            if (this.engine.state.dirty) {
                this.engine.save();
            }
        }, 1200);
    }

    unbind() {
        if (!this.bound) return;
        this.bound = false;

        window.removeEventListener("keydown", this.handleKeyDown);
        clearInterval(this.saveInterval);
    }

    handleKeyDown = (e) => {
        // Command palette
        if (e.metaKey && e.key.toLowerCase() === "k") {
            e.preventDefault();
            this.engine.toggleCommandPalette();
            return;
        }

        // Mode switching
        if (e.metaKey && e.key === "1") this.engine.setMode("design");
        if (e.metaKey && e.key === "2") this.engine.setMode("preview");
        if (e.metaKey && e.key === "3") this.engine.setMode("inspect");

        // Save
        if (e.metaKey && e.key.toLowerCase() === "s") {
            e.preventDefault();
            this.engine.save();
        }
    };
}
