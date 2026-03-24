/**
 * PreviewHost
 * ----------------------------------------------------
 * A lightweight host environment for the runtime preview.
 *
 * Responsibilities:
 * - Provide a stable container for RuntimeRenderer
 * - Expose a deterministic API for rendering + updates
 * - Maintain isolation from the Builder UI
 */

export default class PreviewHost {
  constructor() {
    this.root = null;
    this.renderer = null;
  }

  /**
   * Attach a renderer instance (RuntimeRenderer)
   */
  attachRenderer(renderer) {
    this.renderer = renderer;
  }

  /**
   * Set the root DOM node where the preview will render
   */
  setRoot(domNode) {
    this.root = domNode;
  }

  /**
   * Render the current app state into the root node
   */
  render(output) {
    if (!this.root) {
      console.warn("PreviewHost: No root node set for rendering.");
      return;
    }

    // Clear previous content
    this.root.innerHTML = "";

    if (output instanceof HTMLElement) {
      this.root.appendChild(output);
    } else if (typeof output === "string") {
      this.root.innerHTML = output;
    } else {
      console.warn("PreviewHost: Unsupported render output:", output);
    }
  }

  /**
   * Reset the preview host (used when app definition changes)
   */
  reset() {
    if (this.root) {
      this.root.innerHTML = "";
    }
  }
}
