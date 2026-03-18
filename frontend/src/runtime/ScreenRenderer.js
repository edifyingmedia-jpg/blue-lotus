/**
 * ScreenRenderer.js
 * ---------------------------------------------------------
 * Responsible for:
 * - Resolving a screen by name
 * - Loading its JSON definition
 * - Rendering the correct React component
 * - Passing project, document, params, and events
 *
 * This is the glue between the runtime engine and the UI layer.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import resolveComponent from "./resolveComponent";

export default class ScreenRenderer {
  constructor() {
    this.root = null;
  }

  /**
   * Render a screen into the #root container
   */
  async render({ screen, project, document, params = {}, events }) {
    const container = document.getElementById("root");

    if (!container) {
      console.error("[ScreenRenderer] Missing #root container");
      return;
    }

    // Lazy-create React root
    if (!this.root) {
      this.root = ReactDOM.createRoot(container);
    }

    try {
      // Load screen JSON definition dynamically
      const screenModule = await import(`../screens/${screen}.json`);
      const screenDefinition = screenModule.default;

      // Resolve the top-level component
      const Component = resolveComponent(screenDefinition.type);

      if (!Component) {
        console.error(`[ScreenRenderer] Unknown component type: ${screenDefinition.type}`);
        return;
      }

      // Render the screen
      this.root.render(
        <Component
          project={project}
          document={document}
          params={params}
          events={events}
          definition={screenDefinition}
        />
      );

      console.log(`[ScreenRenderer] Rendered screen: ${screen}`);
    } catch (err) {
      console.error(`[ScreenRenderer] Failed to render screen "${screen}":`, err);
    }
  }
}
