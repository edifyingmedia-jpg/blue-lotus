import React from "react";
import ComponentResolver from "./ComponentResolver";

/**
 * ScreenRenderer.jsx
 * ----------------------------------------------------
 * React-based renderer for Builder Preview mode.
 *
 * This is used ONLY inside the Builder UI (LivePreview),
 * not in deployed apps. Deployed apps use the HTML-based
 * ScreenRenderer.js engine.
 *
 * Responsibilities:
 * - Resolve components
 * - Render React component tree
 * - Pass props, state, and navigation handlers
 */

export default function ScreenRendererJSX({
  screen,
  getState,
  setState,
  navigate,
}) {
  if (!screen || !screen.layout) {
    return (
      <div style={{ padding: 20, color: "#900" }}>
        Invalid screen definition
      </div>
    );
  }

  const renderNode = (node) => {
    if (!node || !node.type) return null;

    const Component = ComponentResolver.resolve(node.type);

    if (!Component) {
      return (
        <div style={{ padding: 10, color: "#b00" }}>
          Unknown component: {node.type}
        </div>
      );
    }

    const props = {
      ...(node.props || {}),
      getState,
      setState,
      navigate,
    };

    let children = null;
    if (node.children && Array.isArray(node.children)) {
      children = node.children.map((child, i) => (
        <React.Fragment key={i}>{renderNode(child)}</React.Fragment>
      ));
    }

    try {
      return <Component {...props}>{children}</Component>;
    } catch (err) {
      console.error(`ScreenRenderer.jsx: Component "${node.type}" failed:`, err);
      return (
        <div style={{ padding: 10, color: "#b00" }}>
          Component error: {node.type}
        </div>
      );
    }
  };

  return <>{renderNode(screen.layout)}</>;
}
