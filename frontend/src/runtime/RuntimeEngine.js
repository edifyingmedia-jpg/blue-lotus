// RuntimeEngine.js
// Core runtime orchestrator for Blue Lotus

import NavigationEngine from "./NavigationEngine";
import StateEngine from "./StateEngine";
import ActionDispatcher from "./ActionDispatcher";
import DocumentModel from "./DocumentModel";

export default class RuntimeEngine {
  constructor() {
    this.appDefinition = null;

    this.navigation = new NavigationEngine();
    this.state = new StateEngine();
    this.dispatcher = new ActionDispatcher({
      navigation: this.navigation,
      state: this.state,
    });

    this.document = null;

    this.onRouteChange = null;
    this.onStateChange = null;

    // Wire state change events
    this.state.subscribe((snapshot) => {
      if (this.onStateChange) {
        this.onStateChange(snapshot);
      }
    });

    // Wire navigation change events
    this.navigation.subscribe((route) => {
      if (this.onRouteChange) {
        this.onRouteChange(route);
      }
    });
  }

  /**
   * Load a full appDefinition JSON document.
   */
  load(appDefinition) {
    if (!appDefinition) {
      throw new Error("[RuntimeEngine] Missing appDefinition");
    }

    this.appDefinition = appDefinition;
    this.document = new DocumentModel(appDefinition);

    // Initialize navigation to first route
    const routes = this.document.getAllRoutes();
    if (routes.length > 0) {
      this.navigation.setRoute(routes[0]);
    }
  }

  /**
   * Get the current active route.
   */
  getCurrentRoute() {
    return this.navigation.getCurrentRoute();
  }

  /**
   * Get a snapshot of the current state.
   */
  getState() {
    return this.state.getSnapshot();
  }

  /**
   * Dispatch an action event.
   */
  dispatch(event) {
    this.dispatcher.dispatchEvent(event);
  }
}
