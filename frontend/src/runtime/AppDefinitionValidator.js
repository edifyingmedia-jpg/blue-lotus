/**
 * AppDefinitionValidator.js
 * ----------------------------------------------------
 * Validates the structure of the app definition JSON
 * before the runtime attempts to render or execute it.
 *
 * Responsibilities:
 *  - Ensure required top-level fields exist
 *  - Validate screens, components, props, bindings, and actions
 *  - Prevent malformed definitions from reaching the runtime
 *  - Provide deterministic, developer-friendly error messages
 */

export default class AppDefinitionValidator {
  constructor() {}

  /**
   * Main entry point.
   * Throws an error if invalid.
   */
  validate(appDefinition) {
    if (!appDefinition || typeof appDefinition !== "object") {
      throw new Error("App definition must be an object");
    }

    this.validateScreens(appDefinition.screens);
    this.validateInitialScreen(appDefinition.initialScreen);
    this.validateState(appDefinition.state);
  }

  /**
   * Validate screens array
   */
  validateScreens(screens) {
    if (!Array.isArray(screens)) {
      throw new Error("App definition must include a screens array");
    }

    for (const screen of screens) {
      this.validateScreen(screen);
    }
  }

  /**
   * Validate a single screen
   */
  validateScreen(screen) {
    if (!screen || typeof screen !== "object") {
      throw new Error("Screen must be an object");
    }

    if (!screen.id || typeof screen.id !== "string") {
      throw new Error("Screen missing required id");
    }

    if (!Array.isArray(screen.components)) {
      throw new Error(`Screen '${screen.id}' must include a components array`);
    }

    for (const component of screen.components) {
      this.validateComponent(component, screen.id);
    }
  }

  /**
   * Validate a component
   */
  validateComponent(component, screenId) {
    if (!component || typeof component !== "object") {
      throw new Error(`Invalid component in screen '${screenId}'`);
    }

    if (!component.type || typeof component.type !== "string") {
      throw new Error(
        `Component in screen '${screenId}' missing required type`
      );
    }

    if (component.props && typeof component.props !== "object") {
      throw new Error(
        `Component '${component.type}' in screen '${screenId}' has invalid props`
      );
    }

    if (component.bindings) {
      this.validateBindings(component.bindings, component.type, screenId);
    }

    if (component.actions) {
      this.validateActions(component.actions, component.type, screenId);
    }

    if (Array.isArray(component.children)) {
      for (const child of component.children) {
        this.validateComponent(child, screenId);
      }
    }
  }

  /**
   * Validate bindings
   */
  validateBindings(bindings, componentType, screenId) {
    if (typeof bindings !== "object") {
      throw new Error(
        `Bindings for component '${componentType}' in screen '${screenId}' must be an object`
      );
    }

    for (const key of Object.keys(bindings)) {
      const binding = bindings[key];

      if (
        typeof binding !== "string" ||
        (!binding.startsWith("$state.") &&
          !binding.startsWith("$props.") &&
          !binding.startsWith("$context."))
      ) {
        throw new Error(
          `Invalid binding '${key}' on component '${componentType}' in screen '${screenId}'`
        );
      }
    }
  }

  /**
   * Validate actions
   */
  validateActions(actions, componentType, screenId) {
    if (!Array.isArray(actions)) {
      throw new Error(
        `Actions for component '${componentType}' in screen '${screenId}' must be an array`
      );
    }

    for (const action of actions) {
      this.validateAction(action, componentType, screenId);
    }
  }

  /**
   * Validate a single action
   */
  validateAction(action, componentType, screenId) {
    if (!action || typeof action !== "object") {
      throw new Error(
        `Invalid action on component '${componentType}' in screen '${screenId}'`
      );
    }

    if (!action.type || typeof action.type !== "string") {
      throw new Error(
        `Action missing type on component '${componentType}' in screen '${screenId}'`
      );
    }

    // Conditional action
    if (action.type === "conditional") {
      if (!action.if || typeof action.if !== "object") {
        throw new Error(
          `Conditional action missing 'if' block on component '${componentType}' in screen '${screenId}'`
        );
      }
    }
  }

  /**
   * Validate initial screen
   */
  validateInitialScreen(initialScreen) {
    if (!initialScreen || typeof initialScreen !== "string") {
      throw new Error("App definition must include an initialScreen string");
    }
  }

  /**
   * Validate initial state
   */
  validateState(state) {
    if (state && typeof state !== "object") {
      throw new Error("App state must be an object if provided");
    }
  }
}
