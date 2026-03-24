/**
 * RenderScreen
 * ----------------------------------------------------
 * Converts a screen definition into a rendered output
 * using the ScreenRenderer and component resolver.
 *
 * Responsibilities:
 * - Accept a screen object
 * - Resolve components
 * - Delegate rendering to ScreenRenderer
 * - Return deterministic output for PreviewHost
 */

import ScreenRenderer from "./ScreenRenderer";
import ComponentResolver from "./ComponentResolver";

export default class RenderScreen {
  constructor({ appDefinition, stateEngine, navigationEngine }) {
    this.appDefinition = appDefinition;
    this.stateEngine = stateEngine;
    this.navigationEngine = navigationEngine;

    this.renderer = new ScreenRenderer({
      resolveComponent: (type) => ComponentResolver.resolve(type),
      getState: (key) => this.stateEngine.getState(key),
      setState: (key, value) => this.stateEngine.setState(key, value),
      navigate: (screenId) => this.navigationEngine.navigate(screenId),
    });
  }

  /**
   * Render a screen by ID
   */
  render(screenId) {
    const screen = this.appDefinition?.screens?.[screenId];

    if (!screen) {
      console.warn(`RenderScreen: Screen "${screenId}" not found.`);
      return `<div style="padding:20px;color:#900;">Screen not found: ${screenId}</div>`;
    }

    try {
      return this.renderer.render(screen);
    } catch (err) {
      console.error("RenderScreen: Failed to render screen:", err);
      return `<div style="padding:20px;color:#900;">Render error: ${err.message}</div>`;
    }
  }
}
