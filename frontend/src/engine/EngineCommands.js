// frontend/src/engine/EngineCommands.js

/**
 * EngineCommands.js
 * ------------------
 * Central registry of all editor commands.
 * Each command:
 *   - has an id
 *   - has a label (shown in UI)
 *   - has an action(engine) function
 *
 * The engine loads these at startup and exposes them
 * to the CommandPalette and Toolbar.
 */

export function createCommandRegistry(engine) {
    return [
        {
            id: "new-scene",
            label: "New Scene",
            action: () => engine.createScene()
        },
        {
            id: "delete-scene",
            label: "Delete Scene",
            action: () => engine.deleteActiveScene()
        },
        {
            id: "duplicate-scene",
            label: "Duplicate Scene",
            action: () => engine.duplicateActiveScene()
        },
        {
            id: "toggle-command-palette",
            label: "Toggle Command Palette",
            action: () => engine.toggleCommandPalette()
        },
        {
            id: "save",
            label: "Save Project",
            action: () => engine.save()
        },
        {
            id: "switch-design-mode",
            label: "Switch to Design Mode",
            action: () => engine.setMode("design")
        },
        {
            id: "switch-preview-mode",
            label: "Switch to Preview Mode",
            action: () => engine.setMode("preview")
        },
        {
            id: "switch-inspect-mode",
            label: "Switch to Inspect Mode",
            action: () => engine.setMode("inspect")
        }
    ];
}
