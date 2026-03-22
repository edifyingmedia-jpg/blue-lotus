// frontend/src/runtime/ComponentResolver.js

/**
 * ComponentResolver
 * ---------------------------------------------------------
 * Converts component definitions from appDefinition into
 * actual React elements with resolved props, bindings, and
 * event handlers.
 *
 * Responsibilities:
 *  - Resolve component type → actual React component
 *  - Resolve props (static + bound)
 *  - Resolve event handlers → ActionDispatcher events
 *  - Recursively build the component tree
 */

import React from "react";
import resolveComponent from "./resolveComponent";

export default class ComponentResolver {
  constructor({ appDefinition, state, dispatcher }) {
    this.appDefinition = appDefinition;
    this.state = state;
    this.dispatcher = dispatcher;
  }

  /**
   * Resolve a component by ID into a React element.
   */
  resolveById(componentId) {
    const def = this.appDefinition.components[componentId];
    if (!def) {
      console.warn(`[ComponentResolver] Unknown component ID: ${componentId}`);
      return null;
    }

    return this._resolve(def);
  }

  /**
   * Internal: resolve a component definition.
   */
  _resolve(def) {
    const { type, props = {}, bindings = {}, events = {}, children = [] } = def;

    // 1. Resolve actual React component
    const Component = resolveComponent(type);
    if (!Component) {
      console.warn(`[ComponentResolver] Unknown component type: ${type}`);
      return null;
    }

    // 2. Resolve props (static + bound)
    const resolvedProps = { ...props };

    for (const key of Object.keys(bindings)) {
      const stateKey = bindings[key];
      resolvedProps[key] = this.state.get(stateKey);
    }

    // 3. Resolve event handlers
    const resolvedEvents = {};
    for (const eventName of Object.keys(events)) {
      const eventDef = events[eventName];
      resolvedEvents[eventName] = () => {
        this.dispatcher.dispatchEvent({
          type: eventName,
          actions: eventDef.actions,
        });
      };
    }

    // 4. Resolve children recursively
    const resolvedChildren = children.map((childId) =>
      this.resolveById(childId)
    );

    // 5. Return final React element
    return React.createElement(
      Component,
      { ...resolvedProps, ...resolvedEvents },
      ...resolvedChildren
    );
  }
}
