// frontend/src/Builder/Canvas.js

/**
 * Canvas (Builder)
 * ---------------------------------------------------------
 * Visual rendering surface for the Builder.
 * Renders the component tree stored in BuilderState.
 *
 * Responsibilities:
 *  - Render components using the runtime resolver
 *  - Allow selecting components
 *  - Provide a visual editing surface for AI-driven refinement
 */

import React from "react";
import { useBuilder } from "./BuilderContext";
import resolver from "../runtime/resolver/resolverComponents";

export default function Canvas() {
  const { builderState, actions } = useBuilder();
  const { components, selected } = builderState;

  function renderComponent(node) {
    const Component = resolver(node.type);

    if (!Component) {
      return (
        <div
          key={node.id}
          style={{
            padding: 10,
            border: "1px solid red",
            margin: 4,
            background: "#ffe6e6"
          }}
        >
          Unknown component: {node.type}
        </div>
      );
    }

    const isSelected = selected === node.id;

    return (
      <div
        key={node.id}
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
        <Component {...node.props} />

        {/* Render children recursively */}
        {node.children?.length > 0 &&
          node.children.map((child) => renderComponent(child))}
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        padding: 20,
        background: "#fafafa",
        overflowY: "auto",
      }}
      onClick={() => actions.selectComponent(null)}
    >
      {components.length === 0 ? (
        <div style={{ opacity: 0.5, textAlign: "center", paddingTop: 40 }}>
          Canvas is empty — add a component to begin.
        </div>
      ) : (
        components.map((node) => renderComponent(node))
      )}
    </div>
  );
}
