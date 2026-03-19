// frontend/src/runtime/renderer/Renderer.js

import React from "react";
import * as Components from "../components";

/**
 * Renderer (Renderer Folder)
 * ---------------------------------------------------------
 * - Renders a JSON tree into actual UI components
 * - Looks up components by name from the registry
 * - Recursively renders children
 * - Supports props, styles, and actions
 * - Pure, stable, predictable
 */

export default function Renderer({ tree }) {
  if (!tree) return null;

  const Component = Components[tree.type];

  if (!Component) {
    console.warn(`Renderer: Unknown component type "${tree.type}"`);
    return null;
  }

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
