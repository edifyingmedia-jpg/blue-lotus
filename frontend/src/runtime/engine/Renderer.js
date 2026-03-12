import React from "react";
import * as Components from "../components";

/**
 * Simple Renderer
 * - Renders a JSON tree into real UI components
 * - Looks up components by name
 * - Recursively renders children
 * - Supports props, styles, and actions
 * - MVP-ready and stable
 */

export default function Renderer({ tree }) {
  if (!tree) return null;

  // Look up the component by name
  const Component = Components[tree.type];

  if (!Component) {
    console.warn(`Renderer: Unknown component type "${tree.type}"`);
    return null;
  }

  // Extract children if present
  const { children, ...props } = tree.props || {};

  return (
    <Component {...props}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <Renderer key={index} tree={child} />
          ))
        : children}
    </Component>
  );
}
