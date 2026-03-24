/**
 * ScreenRenderer.js
 * ----------------------------------------------------
 * Renders a screen definition into a React element tree.
 *
 * Responsibilities:
 *  - Walk the component tree defined in the app definition
 *  - Resolve component types via ComponentResolver
 *  - Bind props, state bindings, and event actions
 *  - Produce a fully constructed React element tree
 */

import React from "react";

export default class ScreenRenderer {
  constructor({
    componentResolver,
    stateEngine,
    actionEngine,
    navigationEngine,
    documentModel,
  }) {
    this.componentResolver = componentResolver;
    this.stateEngine = stateEngine;
    this.actionEngine = actionEngine;
    this.navigationEngine = navigationEngine;
    this.documentModel = documentModel;

    if (!componentResolver) throw new Error("ScreenRenderer requires componentResolver");
    if (!stateEngine) throw new Error("ScreenRenderer requires stateEngine");
    if (!actionEngine) throw new Error("ScreenRenderer requires actionEngine");
    if (!navigationEngine) throw new Error("ScreenRenderer requires navigationEngine");
    if (!documentModel) throw new Error("ScreenRenderer requires documentModel");
  }

  /**
   * Render a screen by ID.
   */
  renderScreen(screenId) {
    const screen = this.documentModel.getScreen(screenId);

    if (!screen || !Array.isArray(screen.components)) {
      throw new Error(`ScreenRenderer: invalid screen '${screenId}'`);
    }

    return (
      <>
        {screen.components.map((component, index) =>
          this.renderComponent(component, index)
        )}
      </>
    );
  }

  /**
   * Render a single component node.
   */
  renderComponent(node, key) {
    if (!node || typeof node !== "object") {
      throw new Error("ScreenRenderer: invalid component node");
    }

    const Component = this.componentResolver.resolve(node.type);

    const props = this.resolveProps(node);
    const eventHandlers = this.resolveActions(node);

    const children = Array.isArray(node.children)
      ? node.children.map((child, index) => this.renderComponent(child, index))
      : null;

    return (
      <Component key={key} {...props} {...eventHandlers}>
        {children}
      </Component>
    );
  }

  /**
   * Resolve props including state bindings.
   */
  resolveProps(node) {
    const props = { ...(node.props || {}) };

    if (node.bindings) {
      for (const key of Object.keys(node.bindings)) {
        const binding = node.bindings[key];

        if (binding.startsWith("$state.")) {
          const path = binding.replace("$state.", "");
          props[key] = this.stateEngine.get(path);
        } else if (binding.startsWith("$context.")) {
          // Reserved for future context injection
          props[key] = null;
        } else if (binding.startsWith("$props.")) {
          // Reserved for component-level props
          props[key] = null;
        }
      }
    }

    return props;
  }

  /**
   * Convert action definitions into event handlers.
   */
  resolveActions(node) {
    if (!node.actions) return {};

    const handlers = {};

    for (const actionDef of node.actions) {
      const eventName = actionDef.event || "onPress";

      handlers[eventName] = () => {
        this.actionEngine.run(actionDef.action);
      };
    }

    return handlers;
  }
}
