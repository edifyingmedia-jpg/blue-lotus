// frontend/src/runtime/ActionDispatcher.js

/**
 * Runtime ActionDispatcher
 * ---------------------------------------------------------
 * Receives component-level events (onPress, onChange, etc.)
 * and dispatches them to the ActionEngine in a standardized way.
 *
 * Responsibilities:
 *  - Normalize event payloads
 *  - Support single or multiple actions
 *  - Support conditional actions
 *  - Never mutate state directly
 *  - Never interpret text commands (builder-only behavior)
 */

export function createActionDispatcher(actionEngine) {
  /**
   * Dispatch a component event.
   *
   * Example event:
   * {
   *   type: "onPress",
   *   actions: [
   *     { type: "navigate", to: "Home" },
   *     { type: "setState", path: "clicked", value: true }
   *   ]
   * }
   */
  async function dispatchEvent(event) {
    if (!event) return;

    const { actions } = event;
    if (!actions) return;

    // Single action
    if (!Array.isArray(actions)) {
      await executeAction(actions);
      return;
    }

    // Multiple actions
    for (const action of actions) {
      await executeAction(action);
    }
  }

  /**
   * Execute a single action object.
   */
  async function executeAction(action) {
    if (!action || typeof action !== "object") return;

    // Inline conditional support
    if (action.if) {
      const condition = action.if;
      const result = await actionEngine.run({
        type: "conditional",
        if: condition,
        then: action.then,
        else: action.else,
      });
      return result;
    }

    // Delegate to ActionEngine
    await actionEngine.run(action);
  }

  return {
    dispatchEvent,
  };
}

export default createActionDispatcher;
