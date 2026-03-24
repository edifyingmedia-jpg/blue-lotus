/**
 * RuntimeEngine
 * ----------------------------------------------------
 * The central orchestrator for the Blue Lotus runtime.
 *
 * Responsibilities:
 * - Load and validate app definitions
 * - Initialize navigation + state engines
 * - Render the active screen
 * - Emit updates to PreviewHost / RuntimeApp
 */

import ProjectLoader from "./ProjectLoader";
import NavigationEngine from "./NavigationEngine";
import StateEngine from "./StateEngine";
import RenderScreen from "./RenderScreen";
import EventBus from "./EventBus";

export default class RuntimeEngine {
  constructor({ onRender }) {
    this.onRender = onRender;

    this.projectLoader = new ProjectLoader();
    this.stateEngine = new StateEngine();
    this.navigationEngine = null;
    this.screenRenderer = null;

    this.definition = null;
  }

  /**
   * Load an app definition into the runtime
   */
  load(definition) {
    const normalized = this.projectLoader.load(definition);
    if (!normalized) return;

    this.definition = normalized;

    // Initialize navigation
    this.navigationEngine = new NavigationEngine({
      appDefinition: this.definition,
      onNavigate: (screenId) => this.render(screenId),
    });

    // Initialize screen renderer
    this.screenRenderer = new RenderScreen({
      appDefinition: this.definition,
      stateEngine: this.stateEngine,
      navigationEngine: this.navigationEngine,
    });

    // Render entry screen
    this.render(this.definition.entryScreen);

    // Notify listeners
    EventBus.emit("runtime:loaded", this.definition);
  }

  /**
   * Render a screen and send output to the host
   */
  render(screenId) {
    if (!this.screenRenderer) return;

    const html = this.screenRenderer.render(screenId);

    if (this.onRender) {
      this.onRender(html);
    }
  }
}
