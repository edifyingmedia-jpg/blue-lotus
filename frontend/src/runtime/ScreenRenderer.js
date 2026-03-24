/**
 * ScreenRenderer
 * ----------------------------------------------------
 * Converts a screen definition into HTML output.
 *
 * Responsibilities:
 * - Resolve components
 * - Render component tree
 * - Pass props, state, and navigation handlers
 * - Produce deterministic HTML output
 */

import ComponentResolver from "./ComponentResolver";

export default class ScreenRenderer {
  constructor({ resolveComponent, getState, setState, navigate }) {
    this.resolveComponent = resolveComponent || ComponentResolver.resolve;
    this.getState = getState;
    this.setState = setState;
    this.navigate = navigate;
  }

  /**
   * Render a full screen object
   */
  render(screen) {
    if (!screen || !screen.layout) {
      return `<div style="padding:20px;color:#900;">Invalid screen definition</div>`;
    }

    try {
      return this.renderNode(screen.layout);
    } catch (err) {
      console.error("ScreenRenderer: Failed to render screen:", err);
      return `<div style="padding:20px;color:#900;">Render error: ${err.message}</div>`;
    }
  }

  /**
   * Render a single node in the component tree
   */
  renderNode(node) {
    if (!node || !node.type) {
      return "";
    }

    const Component = this.resolveComponent(node.type);

    if (!Component) {
      return `<div style="padding:10px;color:#b00;">Unknown component: ${node.type}</div>`;
    }

    const props = {
      ...(node.props || {}),
      getState: this.getState,
      setState: this.setState,
      navigate: this.navigate,
    };

    // Render children recursively
    let children = "";
    if (node.children && Array.isArray(node.children)) {
      children = node.children.map((child) => this.renderNode(child)).join("");
    }

    try {
      return Component.render(props, children);
    } catch (err) {
      console.error(`ScreenRenderer: Component "${node.type}" failed:`, err);
      return `<div style="padding:10px;color:#b00;">Component error: ${node.type}</div>`;
    }
  }
}
