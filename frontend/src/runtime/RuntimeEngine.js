// frontend/src/runtime/RuntimeEngine.js

/**
 * RuntimeEngine
 * ---------------------------------------------------------
 * The orchestrator of the Blue Lotus runtime.
 *
 * Responsibilities:
 *  - Load and validate the appDefinition
 *  - Initialize NavigationEngine, StateEngine, ActionEngine
 *  - Wire ActionDispatcher → ActionEngine
 *  - Wire NavigationEngine → Renderer
 *  - Provide a unified API to PreviewHost + LivePreview
 *  - Ensure deterministic, reproducible runtime behavior
 */

import NavigationEngine from "./NavigationEngine";
import StateEngine from "./StateEngine";
import ActionEngine from "./ActionEngine";
import createActionDispatcher from "./ActionDispatcher";
import RuntimeRenderer from "./RuntimeRenderer";

export default class RuntimeEngine {
  constructor({ onRouteChange, onStateChange } = {}) {
    this.onRouteChange = onRouteChange || null;
    this.onStateChange = onStateChange || null;

    this.appDefinition = null;

    // Engines
    this.navigation = null;
    this.state = null;
    this.actions = null;
    this.dispatcher = null;
    this.renderer = null;
  }

  /**
   * Load a new appDefinition and rebuild the runtime.
   */
  load(appDefinition) {
    if (!appDefinition) {
      console.error("[RuntimeEngine] Missing appDefinition");
      return;
    }

    this.appDefinition = appDefinition;

    const { routes, initialState } = appDefinition;

    // --- Initialize engines ---
    this.navigation = new NavigationEngine({
      routes,
      onNavigate: (evt) => {
        if (this.onRouteChange) this.onRouteChange(evt.route);
        this._render();
      },
    });

    this.state = new StateEngine({
      onStateChange: (newState) => {
        if (this.onStateChange) this.onStateChange(newState);
        this._render();
      },
    });

    this.actions = new ActionEngine({
      navigation: this.navigation,
      state: this.state,
    });

    this.dispatcher = createActionDispatcher(this.actions);

    this.renderer = new RuntimeRenderer({
      appDefinition,
      navigation: this.navigation,
      state: this.state,
      dispatcher: this.dispatcher,
    });

    // --- Initialize state + navigation ---
    this.state.init(initialState || {});
    this.navigation.init(appDefinition.initialRoute);

    // Initial render
    this._render();
  }

  /**
   * Render the current route/component tree.
   */
  _render() {
    if (!this.renderer) return;
    this.renderer.render();
  }

  /**
   * Public API: dispatch a component event.
   */
  dispatchEvent(event) {
    if (!this.dispatcher) return;
    this.dispatcher.dispatchEvent(event);
  }

  /**
   * Public API: get the current route.
   */
  getCurrentRoute() {
    return this.navigation?.getCurrentRoute() || null;
  }

  /**
   * Public API: get current state snapshot.
   */
  getState() {
    return this.state?.state || {};
  }
}
