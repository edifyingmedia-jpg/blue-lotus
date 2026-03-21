// frontend/src/Builder/ComponentRenderer.js

/**
 * ComponentRenderer (Builder)
 * ---------------------------------------------------------
 * Renders a single component node inside the Builder Canvas.
 * This is the Builder-side equivalent of the runtime Renderer,
 * but with selection, outlines, and BuilderContext integration.
 */

import React from "react";
import { useBuilder } from "./BuilderContext";
import resolver from "../runtime/resolver/resolverComponents";

export default function ComponentRenderer({ node }) {
  const { actions, builderState } = useBuilder();
  const { selected } = builderState;

  if (!node) return null;

  const Component = resolver(node.type);

  if (!Component) {
    return (
      <div
        style={{
          padding: 10,
          border: "1px solid red",
          margin: 4,
          background: "#ffe6e6",
        }}
      >
        Unknown component: {node.type}
      </div>
    );
  }

  const isSelected = selected === node.id;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        actions.selectComponent(node.id);
      }}
      style={{
        outline: isSelected ? "2px solid #4da3ff" : "none",
        padding: 4,
        margin: 4,
        borderRadius: 4,
      }}
    >
      {/* Render the actual component */}
      <Component {...node.props} />

      {/* Render children recursively */}
      {node.children?.length > 0 &&
        node.children.map((child) => (
          <ComponentRenderer key={child.id} node={child} />
        ))}
    </div>
  );
}
