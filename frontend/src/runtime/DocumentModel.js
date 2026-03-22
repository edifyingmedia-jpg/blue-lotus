// frontend/src/runtime/DocumentModel.js

/**
 * DocumentModel
 * ---------------------------------------------------------
 * Provides structured access to the appDefinition document.
 *
 * Responsibilities:
 *  - Validate the document structure
 *  - Expose component definitions by ID
 *  - Expose route → rootComponentId mapping
 *  - Provide helpers for the runtime renderer
 */

export default class DocumentModel {
  constructor(appDefinition) {
    if (!appDefinition) {
      throw new Error("[DocumentModel] Missing appDefinition");
    }

    this.appDefinition = appDefinition;
    this.components = appDefinition.components || {};
    this.routes = appDefinition.routes || {};
  }

  /**
   * Get a component definition by ID.
   */
  getComponent(id) {
    const def = this.components[id];
    if (!def) {
      console.warn(`[DocumentModel] Unknown component ID: ${id}`);
      return null;
    }
    return def;
  }

  /**
   * Get the root component ID for a route.
   */
  getRootComponentForRoute(routeName) {
    const route = this.routes[routeName];
    if (!route) {
      console.warn(`[DocumentModel] Unknown route: ${routeName}`);
      return null;
    }
    return route.rootComponentId;
  }

  /**
   * Return all component IDs.
   */
  getAllComponentIds() {
    return Object.keys(this.components);
  }

  /**
   * Return all route names.
   */
  getAllRoutes() {
    return Object.keys(this.routes);
  }
}
