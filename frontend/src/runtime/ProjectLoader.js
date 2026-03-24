/**
 * ProjectLoader
 * ----------------------------------------------------
 * Loads, validates, and prepares an app definition
 * for the runtime engine.
 *
 * Responsibilities:
 * - Accept raw project JSON
 * - Validate structure using AppDefinitionValidator
 * - Normalize screens, components, and metadata
 * - Emit load events for the preview/runtime
 */

import AppDefinitionValidator from "./AppDefinitionValidator";
import EventBus from "./EventBus";

export default class ProjectLoader {
  constructor() {
    this.definition = null;
  }

  /**
   * Load a raw project definition
   */
  load(rawDefinition) {
    if (!rawDefinition) {
      console.warn("ProjectLoader: No project definition provided.");
      return null;
    }

    // Validate structure
    const validation = AppDefinitionValidator.validate(rawDefinition);
    if (!validation.valid) {
      console.error("ProjectLoader: Invalid app definition:", validation.errors);
      return null;
    }

    // Normalize structure
    this.definition = this.normalize(rawDefinition);

    // Notify runtime + preview
    EventBus.emit("project:loaded", this.definition);

    return this.definition;
  }

  /**
   * Normalize app definition into a predictable structure
   */
  normalize(def) {
    return {
      id: def.id || "untitled",
      name: def.name || "Untitled App",
      entryScreen: def.entryScreen || Object.keys(def.screens || {})[0] || null,
      screens: def.screens || {},
      components: def.components || {},
      metadata: def.metadata || {},
    };
  }

  /**
   * Get the current normalized definition
   */
  getDefinition() {
    return this.definition;
  }
}
