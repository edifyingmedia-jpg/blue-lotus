// frontend/src/runtime/resolver/Renderer.js

/**
 * Renderer.js
 * ---------------------------------------------------------
 * The core runtime renderer for Blue Lotus.
 *
 * Responsibilities:
 *  - Take a component node from the Builder
 *  - Resolve its type to a real React component
 *  - Render it with props
 *  - Recursively render children
 */

import React from "react";
import resolverComponents from "./resolverComponents";

export default function Renderer({ node }) {
  if (!node || typeof node !== "object") {
    return null;
  }

  const Component = resolverComponents(node.type);

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

  return (
    <Component {...node.props}>
      {Array.isArray(node.children) &&
        node.children.map((child) => (
          <Renderer key={child.id} node={child} />
        ))}
    </Component>
  );
}
