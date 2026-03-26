/**
 * PreviewHost.js
 * ----------------------------------------------------
 * Manages the lifecycle of a LivePreview instance.
 *
 * Responsibilities:
 *  - Create/destroy LivePreview
 *  - Mount preview into a DOM container
 *  - Update preview when appDefinition changes
 *  - Keep preview sandbox isolated and deterministic
 */

import LivePreview from "./LivePreview";
import { deepClone } from "./utils";

export default class PreviewHost {
  constructor() {
    this.preview = null;
    this.domNode = null;
    this.currentDefinition = null;
  }

  /**
   * Mount preview into a DOM node
   */
  mount(domNode, appDefinition, initialState = {}) {
    if (!domNode) {
      throw new Error("PreviewHost.mount requires a DOM node");
    }
    if (!appDefinition) {
      throw new Error("PreviewHost.mount requires an appDefinition");
    }

    this.domNode = domNode;
    this.currentDefinition = deepClone(appDefinition);

    // Destroy any existing preview
    if (this.preview) {
      this.preview.destroy();
    }

    this.preview = new LivePreview({
      appDefinition: this.currentDefinition,
      initialState,
      onEvent: (evt) => this._handlePreviewEvent(evt),
    });

    this.preview.mount(domNode);
  }

  /**
   * Update the app definition (already validated externally)
   */
  updateDefinition(newDefinition) {
    if (!this.preview) return;
    if (!newDefinition) return;

    this.currentDefinition = deepClone(newDefinition);
    this.preview.updateDefinition(this.currentDefinition);
  }

  /**
   * Update preview state
   */
  updateState(patch) {
    if (!this.preview) return;
    this.preview.updateState(patch);
  }

  /**
   * Destroy preview instance
   */
  destroy() {
    if (this.preview) {
      this.preview.destroy();
      this.preview = null;
    }

    this.domNode = null;
    this.currentDefinition = null;
  }

  /**
   * Internal event handler
   */
  _handlePreviewEvent(evt) {
    // Reserved for future extension
    // (e.g., analytics, logging, builder sync)
  }
}
