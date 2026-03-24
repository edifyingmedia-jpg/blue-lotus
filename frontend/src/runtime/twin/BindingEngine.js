/**
 * BindingEngine.js
 * ----------------------------------------------------
 * Resolves binding expressions used throughout the runtime.
 *
 * Bindings allow components to reference:
 * - global state
 * - local state
 * - theme tokens
 * - navigation params
 * - computed expressions
 *
 * This engine is synchronous and deterministic.
 */

import StateManager from "../state/stateManager";
import NavigationEngine from "../navigation/NavigationEngine";
import { getToken } from "../theme/theme";

class BindingEngine {
  /**
   * Resolve a binding expression.
   *
   * Examples:
   *   "@state.user.name"
   *   "@local.form.email"
   *   "@theme.colors.primary"
   *   "@nav.params.projectId"
   */
  resolve(binding) {
    if (!binding || typeof binding !== "string") return binding;

    if (!binding.startsWith("@")) return binding;

    const [root, ...pathParts] = binding.slice(1).split(".");
    const path = pathParts.join(".");

    switch (root) {
      case "state":
        return this.getFromObject(StateManager.get(pathParts[0]), pathParts.slice(1));

      case "local":
        return this.getFromObject(StateManager.local.get(pathParts[0]), pathParts.slice(1));

      case "theme":
        return getToken(path);

      case "nav":
        return this.resolveNavigation(pathParts);

      default:
        console.error(`BindingEngine: Unknown binding root "${root}"`);
        return undefined;
    }
  }

  /**
   * Resolve navigation bindings.
   */
  resolveNavigation(parts) {
    const [section, ...rest] = parts;

    if (section === "params") {
      const params = NavigationEngine.getParams();
      return this.getFromObject(params, rest);
    }

    if (section === "current") {
      return NavigationEngine.getCurrentScreen();
    }

    return undefined;
  }

  /**
   * Safely walk nested objects.
   */
  getFromObject(obj, parts) {
    let current = obj;
    for (const part of parts) {
      if (current && Object.prototype.hasOwnProperty.call(current, part)) {
        current = current[part];
      } else {
        return undefined;
      }
    }
    return current;
  }
}

const engine = new BindingEngine();
export default engine;
