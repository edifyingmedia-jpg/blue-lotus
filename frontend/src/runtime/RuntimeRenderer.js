/**
 * RuntimeRenderer
 * ----------------------------------------------------
 * Converts the current screen into HTML output using:
 * - RenderScreen
 * - StateEngine
 * - NavigationEngine
 * - ComponentResolver
 *
 * This is the core rendering engine used by both:
 * - LivePreview (Builder)
 * - RuntimeApp (Deployed App)
 */

import RenderScreen from "./RenderScreen";
import StateEngine from "./StateEngine";
import NavigationEngine from "./NavigationEngine";
import EventBus from "./EventBus";

export default class RuntimeRenderer {
  constructor({ host, onNavigate }) {
    this.host = host;
    this.onNavigate = onNavigate;

    this.definition = null;

    this.stateEngine = new StateEngine();
    this.navigationEngine = null;
    this.screenRenderer = null;
  }

  /**
   * Load a new app definition
   */
  loadApp(definition, initialScreen) {
    if (!definition) {
      console.warn("RuntimeRenderer: No app definition provided.");
      return;
    }

    this.definition = definition;

    // Initialize navigation
    this.navigationEngine = new NavigationEngine({
      appDefinition: this.definition,
      onNavigate: (screenId) => {
        if (this.onNavigate) this.onNavigate(screenId);
        this.render();
      },
    });

    // Initialize screen renderer
    this.screenRenderer = new RenderScreen({
      appDefinition: this.definition,
      stateEngine: this.stateEngine,
      navigationEngine: this.navigationEngine,
    });

    // Set initial screen
    if (initialScreen) {
      this.navigationEngine.navigate(initialScreen);
    }

    this.render();
  }

  /**
   * Navigate to a screen
   */
  navigate(screenId) {
    if (!this.navigationEngine) return;
    this.navigationEngine.navigate(screenId);
    this.render();
  }

  /**
   * Render the current screen
   */
  render() {
    if (!this.screenRenderer || !this.navigationEngine) return;

    const screenId = this.navigationEngine.getCurrentScreen();
    const output = this.screenRenderer.render(screenId);

    if (this.host) {
      this.host.render(output);
    }

    EventBus.emit("runtime:render", { screenId, output });

    return output;
  }
}
