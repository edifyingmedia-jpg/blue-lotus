// frontend/src/runtime/ActionDispatcher.js

/**
 * ActionDispatcher.js
 * -------------------
 * Central command router for Blue Lotus.
 * All user intents (typed or voice) flow through here.
 *
 * Responsibilities:
 *   - Normalize commands
 *   - Validate payloads
 *   - Dispatch clean actions to the reducer
 *   - Never mutate state directly
 */

export function createActionDispatcher(dispatch) {
  /**
   * Main entry point for all commands.
   * `command` is a string like:
   *   "create scene Main"
   *   "rename scene 123 to Dashboard"
   *   "update content 123 <new text>"
   */
  function handleCommand(command, payload = {}) {
    if (!command || typeof command !== "string") return;

    const normalized = command.trim().toLowerCase();

    // --- Scene creation ---
    if (normalized.startsWith("create scene")) {
      const name = payload.name || extractName(command);
      if (!name) return;

      dispatch({
        type: "SCENE_CREATE",
        name
      });
      return;
    }

    // --- Scene rename ---
    if (normalized.startsWith("rename scene")) {
      const { id, newName } = payload;
      if (!id || !newName) return;

      dispatch({
        type: "SCENE_RENAME",
        id,
        newName
      });
      return;
    }

    // --- Scene content update ---
    if (normalized.startsWith("update content")) {
      const { id, content } = payload;
      if (!id) return;

      dispatch({
        type: "SCENE_UPDATE_CONTENT",
        id,
        content: content ?? ""
      });
      return;
    }

    // --- Unknown command ---
    dispatch({
      type: "COMMAND_UNKNOWN",
      raw: command
    });
  }

  /**
   * Extract a scene name from a command like:
   *   "create scene Main"
   */
  function extractName(cmd) {
    const parts = cmd.split(" ");
    return parts.length >= 3 ? parts.slice(2).join(" ") : null;
  }

  return {
    handleCommand
  };
}
