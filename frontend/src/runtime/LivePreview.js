/**
 * LivePreview.js
 * ----------------------------------------------------
 * Deterministic, runtime-faithful preview sandbox.
 *
 * Responsibilities:
 *  - Initialize isolated runtime engines
 *  - Render app definition using AppRenderer
 *  - React to state, navigation, and definition updates
 *  - Emit lifecycle events through eventBus
 *  - Never mutate appDefinition or leak side effects
 */

import React from "react";
import ReactDOM from "react-dom/client";

import StateEngine from "./StateEngine";
import NavigationEngine from "./NavigationEngine";
import ActionEngine from "./ActionEngine";
import AppRenderer from "./AppRenderer";

import eventBus from "./utils/eventBus";
import { deepClone } from "./utils";

export default class LivePreview {
  constructor({ appDefinition, initialState = {}, onEvent = null }) {
    if (!appDefinition) {
      throw new Error("LivePreview requires a validated appDefinition");
    }

    // Immutable definition
    this.appDefinition = deepClone(appDefinition);
    Object.freeze(this.appDefinition);

    this.onEvent = typeof onEvent === "function" ? onEvent : null;

    // Engines
    this.stateEngine = new StateEngine(initialState);
    this.navigationEngine = new NavigationEngine();
    this.actionEngine = new ActionEngine({
      stateEngine: this.stateEngine,
      navigationEngine: this.navigationEngine,
    });

    // DOM + React root
    this.domNode = null;
    this.reactRoot = null;

    // Bindings
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleNavigationChange = this.handleNavigationChange.bind(this);

    // Subscribe to engine events
    eventBus.on("state:changed", this.handleStateChange);
    eventBus.on("navigation:changed", this.handleNavigationChange);
  }

  /**
   * Mount preview into a DOM node
   */
  mount(domNode) {
    if (!domNode) {
      throw new Error("LivePreview.mount requires a DOM node");
    }

    this.domNode = domNode;
    this.reactRoot = ReactDOM.createRoot(domNode);

    this.renderApp();

    eventBus.emit("preview:mounted");
    this._emit("mounted");
  }

  /**
   * Render the app using AppRenderer
   */
  renderApp() {
    try {
      const element = (
        <AppRenderer
          appDefinition={this.appDefinition}
          stateEngine={this.stateEngine}
          navigationEngine={this.navigationEngine}
          actionEngine={this.actionEngine}
        />
      );

      this.reactRoot.render(element);

      eventBus.emit("preview:render");
      this._emit("render");
    } catch (err) {
      console.error("LivePreview render error:", err);
      eventBus.emit("preview:error", err);
      this._emit("error", err);
    }
  }

  /**
   * Update app definition (already validated externally)
   */
  updateDefinition(newDefinition) {
    if (!newDefinition) return;

    this.appDefinition = deepClone(newDefinition);
    Object.freeze(this.appDefinition);

    this.renderApp();

    event
