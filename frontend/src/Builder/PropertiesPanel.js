// frontend/src/Builder/PropertiesPanel.js

/**
 * PropertiesPanel (Builder)
 * ---------------------------------------------------------
 * Right-side inspector panel for editing component props.
 *
 * Responsibilities:
 *  - Display selected component
 *  - Allow editing props
 *  - Sync changes with BuilderState
 *  - Provide a clean UI surface for AI-driven refinement
 */

import React from "react";
import { useBuilder } from "./BuilderContext";

export default function PropertiesPanel() {
  const { builderState, actions } = useBuilder();
  const { components, selected } = builderState;

  if (!selected) {
    return (
      <div
        style={{
          width: 300,
          background: "#ffffff",
          borderLeft: "1px solid #e5e5e5",
          padding: 20,
          opacity: 0.6,
          fontSize: 14
        }}
      >
        No component selected.
      </div>
    );
  }

  const component = components.find((c) => c.id === selected);

  if (!component) {
    return (
      <div
        style={{
          width: 300,
          background: "#ffffff",
          borderLeft: "1px solid #e5e5e5",
          padding: 20,
          color: "red"
        }}
      >
        Selected component not found.
      </div>
    );
  }

  function updateProp(key, value) {
    actions.updateComponent(component.id, {
      props: {
        ...component.props,
        [key]: value
      }
    });
  }

  return (
    <div
      style={{
        width: 300,
        background: "#ffffff",
        borderLeft: "1px solid #e5e5e5",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 20
      }}
    >
      <h3 style={{ margin: 0, fontSize: 18 }}>Properties</h3>

      <div style={{ opacity: 0.7, fontSize: 14 }}>
        Type: <strong>{component.type}</strong>
      </div>

      {/* Render editable props */}
      {Object.entries(component.props || {}).map(([key, value]) => (
        <div key={key} style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontSize: 13, marginBottom: 4 }}>{key}</label>
          <input
            type="text"
            value={value}
            onChange={(e) => updateProp(key, e.target.value)}
            style={{
              padding: 8,
              border: "1px solid #ccc",
              borderRadius: 4
            }}
          />
        </div>
      ))}

      {/* Add new prop */}
      <AddNewProp component={component} updateProp={updateProp} />
    </div>
  );
}

function AddNewProp({ component, updateProp }) {
  const [key, setKey] = React.useState("");
  const [value, setValue] = React.useState("");

  function add() {
    if (!key.trim()) return;
    updateProp(key, value);
    setKey("");
    setValue("");
  }

  return (
    <div style={{ marginTop: 10 }}>
      <h4 style={{ marginBottom: 8 }}>Add Property</h4>

      <input
        type="text"
        placeholder="prop name"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        style={{
          width: "100%",
          padding: 8,
          border: "1px solid #ccc",
          borderRadius: 4,
          marginBottom: 8
        }}
      />

      <input
        type="text"
        placeholder="value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{
          width: "100%",
          padding: 8,
          border: "1px solid #ccc",
          borderRadius: 4,
          marginBottom: 8
        }}
      />

      <button
        onClick={add}
        style={{
          width: "100%",
          padding: 10,
          background: "#4da3ff",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer"
        }}
      >
        Add
      </button>
    </div>
  );
}
