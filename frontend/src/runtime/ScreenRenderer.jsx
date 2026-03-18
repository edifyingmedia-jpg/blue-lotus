/**
 * ScreenRenderer.jsx
 * ---------------------------------------------------------
 * React-side renderer for Blue Lotus runtime.
 *
 * Responsibilities:
 * - Receive a JSON screen definition from ScreenRenderer.js
 * - Resolve the correct component
 * - Render with project, document, params, events
 * - Provide a clean, predictable rendering lifecycle
 */

import React from "react";
import resolveComponent from "./resolveComponent";

export default function ScreenRenderer({
  definition,
  project,
  document,
  params = {},
  events,
}) {
  if (!definition) {
    console.error("[ScreenRenderer.jsx] Missing screen definition");
    return <div>Screen definition missing</div>;
  }

  const { type, props = {}, children = [] } = definition;

  // Resolve top-level component
  const Component = resolveComponent(type);

  if (!Component) {
    console.error(`[ScreenRenderer.jsx] Unknown component type: ${type}`);
    return <div>Unknown component: {type}</div>;
  }

  /**
   * Recursively render child nodes
   */
  const renderNode = (node, index) => {
    if (!node || typeof node !== "object") return null;

    const NodeComponent = resolveComponent(node.type);

    if (!NodeComponent) {
      console.warn(`[ScreenRenderer.jsx] Unknown child component: ${node.type}`);
      return null;
    }

    const childProps = {
      key: index,
      ...node.props,
      project,
      document,
      params,
      events,
    };

    if (node.children && Array.isArray(node.children)) {
      return (
        <NodeComponent {...childProps}>
          {node.children.map((child, i) => renderNode(child, i))}
        </NodeComponent>
      );
    }

    return <NodeComponent {...childProps} />;
  };

  /**
   * Render the root component
   */
  return (
    <Component
      {...props}
      project={project}
      document={document}
      params={params}
      events={events}
    >
      {children.map((child, i) => renderNode(child, i))}
    </Component>
  );
}
