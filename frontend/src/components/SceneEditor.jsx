/**
 * SceneEditor.jsx
 * ---------------------------------------------------------
 * Renders the active scene using the Builder engine.
 * Displays the component tree and forwards actions upward.
 */

import React from "react";
import "./SceneEditor.css";

export default function SceneEditor({ scene, state, dispatch }) {
  if (!scene) {
    return (
      <div className="scene-editor-root">
        <div className="scene-editor-empty">No scene selected</div>
      </div>
    );
  }

  /**
   * Recursively render a node in the scene tree.
   * Each node has:
   *  - id
   *  - type (component type)
   *  - props
   *  - children (array)
   */
  const renderNode = (node) => {
    if (!node) return null;

    // Look up the actual React component from the registry
    const Component = state.registry[node.type];

    if (!Component) {
      return (
        <div className="unknown-component">
          Unknown component: {node.type}
        </div>
      );
    }

    const isSelected = state.selectedComponentId === node.id;

    const handleSelect = (e) => {
      e.stopPropagation();
      dispatch({
        type: "SELECT_COMPONENT",
        payload: { componentId: node.id },
      });
    };

    return (
      <div
        className={`scene-node-wrapper ${isSelected ? "selected" : ""}`}
        onClick={handleSelect}
      >
        <Component {...node.props}>
          {node.children?.map((child) => renderNode(child))}
        </Component>
      </div>
    );
  };

  return (
    <div className="scene-editor-root">
      {renderNode(scene.root)}
    </div>
  );
}
