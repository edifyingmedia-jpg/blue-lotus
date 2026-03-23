// frontend/src/runtime/resolver/Renderer.js

/**
 * Renderer.js
 * ---------------------------------------------------------
 * Core recursive renderer for Blue Lotus runtime.
 *
 * Responsibilities:
 *  - Resolve a node's component type
 *  - Resolve props (including bindings)
 *  - Recursively render children
 *  - Return a fully constructed React element tree
 */

import React from "react";
import ComponentResolver from "./ComponentResolver";
import resolveProps from "./resolveProps";
import useRuntimeDataBindings from "./useRuntimeDataBindings";

export default function Renderer(node, model) {
  if (!node || typeof node !== "object") {
    return null;
  }

  const resolver = new ComponentResolver();
  const bindings = useRuntimeDataBindings(model?.bindings || {});

  // Resolve the component type
  const Component = resolver.get(node.type);

  if (!Component) {
    return (
      <div
        style={{
          padding: 10,
          border: "1px solid red",
          background: "#ffe6e6",
          margin: 4,
        }}
      >
        Unknown component: {node.type}
      </div>
    );
  }

  // Resolve props (including dynamic bindings)
  const props = resolveProps(node.props || {}, bindings);

  // Recursively render children
  let children = null;

  if (Array.isArray(node.children)) {
    children = node.children.map((child, index) =>
      Renderer(child, model, index)
    );
  }

  return <Component {...props}>{children}</Component>;
}
