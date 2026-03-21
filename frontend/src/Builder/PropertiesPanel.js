// frontend/src/Builder/PropertiesPanel.js

/**
 * PropertiesPanel (Builder)
 * ---------------------------------------------------------
 * Displays and edits the props of the currently selected
 * component in the Builder Canvas.
 */

import React from "react";
import { useBuilder } from "./BuilderContext";

export default function PropertiesPanel() {
  const { builderState, actions } = useBuilder();
  const { selected, screens, currentScreen } = builderState;

  const screen = screens[currentScreen];
  if (!screen) return null;

  const findNode = (node, id) => {
    if (!node) return null;
    if (node.id === id) return node;
    for (const child of node.children || []) {
      const found = findNode(child, id);
      if (found) return found;
    }
    return null;
  };

  const node = selected ? findNode(screen.root, selected) : null;

  if (!node) {
    return (
      <div
        style={{
          width: 280,
          borderLeft: "1px solid #e2e8f0",
          padding: 16,
          background: "#fafbfc",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Properties</h3>
        <p style={{ opacity: 0.6 }}>No component selected.</p>
      </div>
    );
  }

  const updateProp = (key, value) => {
    actions.updateComponentProps(node.id, { [key]: value });
  };

  return (
    <div
      style={{
        width: 280,
        borderLeft: "1px solid #e2e8f0",
        padding: 16,
        background: "#fafbfc",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <h3 style={{ marginTop: 0 }}>Properties</h3>

      <div>
        <strong>Type:</strong> {node.type}
      </div>

      {Object.entries(node.props || {}).map(([key, value]) => (
        <div key={key} style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontSize: 12, opacity: 0.7 }}>{key}</label>
          <input
            value={value}
            onChange={(e) => updateProp(key, e.target.value)}
            style={{
              padding: 6,
              borderRadius: 4,
              border: "1px solid #cbd5e1",
            }}
          />
        </div>
      ))}
    </div>
  );
}
