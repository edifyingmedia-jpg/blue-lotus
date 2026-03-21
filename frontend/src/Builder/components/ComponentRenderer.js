// frontend/src/Builder/components/ComponentRenderer.js

/**
 * ComponentRenderer
 * ---------------------------------------------------------
 * Translates JSON nodes into real React components using
 * the ComponentRegistry. This is the heart of the Builder's
 * rendering engine.
 *
 * Example node:
 * {
 *   type: "Button",
 *   props: { text: "Click me" },
 *   children: [...]
 * }
 */

import React from "react";
import { resolveComponent } from "./ComponentRegistry";

export function ComponentRenderer({ node }) {
  if (!node || typeof node !== "object") {
    return null;
  }

  const { type, props = {}, children = [] } = node;

  // Look up the actual React component
  const Component = resolveComponent(type);

  if (!Component) {
    return (
      <div style={{ color: "red", padding: "8px" }}>
        Unknown component type: <strong>{type}</strong>
      </div>
    );
  }

  // Render children recursively
  const renderedChildren = Array.isArray(children)
    ? children.map((child, index) => (
        <ComponentRenderer key={index} node={child} />
      ))
    : null;

  return <Component {...props}>{renderedChildren}</Component>;
}
