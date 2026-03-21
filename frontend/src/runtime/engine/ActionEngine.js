// frontend/src/runtime/engine/ActionEngine.js

/**
 * ActionEngine
 * ---------------------------------------------------------
 * Executes actions triggered by components at runtime.
 * Handles navigation, state updates, and async operations.
 */

export default class ActionEngine {
  constructor({ navigation, state }) {
    this.navigation = navigation;
    this.state = state;
  }

  /**
   * Execute an action definition.
   */
  run(action) {
    if (!action || !action.type) {
      console.warn("ActionEngine: Invalid action", action);
      return;
    }

    switch (action.type) {
      case "navigate":
        return this.navigation.goTo(action.screenId);

      case "setState":
        return this.state.update(action.key, action.value);

      case "alert":
        return window.alert(action.message);

      case "log":
        return console.log("Runtime Log:", action.message);

      default:
        console.warn("ActionEngine: Unknown action type:", action.type);
    }
  }
}
