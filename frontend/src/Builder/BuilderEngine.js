// frontend/src/Builder/BuilderEngine.js

/**
 * BuilderEngine
 * ---------------------------------------------------------
 * Initializes the Builder environment:
 * - Registers all components
 * - Loads the project into BuilderContext
 * - Provides a clean entry point for the Builder shell
 */

import registerComponents from "./registerComponents";
import ProjectLoader from "./ProjectLoader";

class BuilderEngine {
  constructor() {
    this.initialized = false;
  }

  /**
   * Initialize the Builder environment.
   */
  init(builderActions, project) {
    if (this.initialized) return;

    // Register all UI components
    registerComponents();

    // Load the project into BuilderContext
    if (project) {
      const normalized = ProjectLoader.load(project);
      builderActions.loadProject(normalized);
    }

    this.initialized = true;
  }
}

// Singleton instance
const instance = new BuilderEngine();
export default instance;
