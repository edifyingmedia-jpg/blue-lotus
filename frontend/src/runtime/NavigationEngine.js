// frontend/src/runtime/NavigationEngine.js

/**
 * NavigationEngine
 * ---------------------------------------------------------
 * A deterministic, route-based navigation controller for
 * the Blue Lotus runtime engine.
 *
 * Responsibilities:
 *  - Validate route names
 *  - Update the current route
 *  - Notify listeners (preview/builder) of route changes
 *
 * It does NOT:
 *  - maintain a navigation stack
 *  - manage modals
 *  - interpret screen-based navigation
 */

export default class NavigationEngine {
  constructor({ routes, onNavigate }) {
    this.routes = routes || {};
    this.onNavigate = onNavigate || null;

    // Current route name
    this.currentRoute = null;
  }

  /**
   * Initialize navigation with an initial route.
   */
  init(initialRoute) {
    if (initialRoute && this.routes[initialRoute]) {
      this.currentRoute = initialRoute;
    } else {
      // fallback to first route
      const keys = Object.keys(this.routes);
      this.currentRoute = keys.length > 0 ? keys[0] : null;
    }

    this._emit();
  }

  /**
   * Navigate to a route by name.
   */
  navigate(routeName) {
    if (!routeName || !this.routes[routeName]) {
      console.warn(`[NavigationEngine] Unknown route "${routeName}"`);
      return;
    }

    this.currentRoute = routeName;
    this._emit();
  }

  /**
   * Get the current route name.
   */
  getCurrentRoute() {
    return this.currentRoute;
  }

  /**
   * Internal: notify listeners.
   */
  _emit() {
    if (this.onNavigate) {
      this.onNavigate({
        type: "routeChange",
        route: this.currentRoute,
      });
    }
  }
}
