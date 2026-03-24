/**
 * ScreenRenderer.js
 * ----------------------------------------------------
 * The final rendering layer for a screen node.
 *
 * Responsibilities:
 * - Resolve the component type using ComponentResolver
 * - Inject runtime data bindings
 * - Render children recursively
 *
 * This file is used by both:
 * - DynamicScreen (navigation-aware)
 * - RenderScreen (screen-level rendering)
 * - SceneManager (nested scenes)
 */

import React from "react";
import ComponentResolver from "../resolver/ComponentResolver";
import useRuntimeDataBindings from "../useRuntimeDataBindings";

export default function ScreenRenderer({ screen, bindings }) {
  if (!screen) return null;

  const { type, props = {}, children = [] } = screen;

  // Resolve the actual React component
  const Component = ComponentResolver.resolve(type);
  if (!Component) {
    console.error(`ScreenRenderer: Unknown component type "${type}"`);
    return null;
  }

  // Merge props with runtime bindings
  const mergedProps = {
    ...props,
    ...bindings,
  };

  return (
    <Component {...mergedProps}>
      {Array.isArray(children) &&
        children.map((child, index) => (
          <ScreenRenderer
            key={index}
            screen={child}
            bindings={useRuntimeDataBindings(child.id, child.props || {})}
          />
        ))}
    </Component>
  );
}
