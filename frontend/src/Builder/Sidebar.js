// frontend/src/Builder/Sidebar.js

/**
 * Sidebar (Builder)
 * ---------------------------------------------------------
 * Left-side control panel for the Blue Lotus Builder.
 *
 * Responsibilities:
 *  - Provide quick actions (add component, delete, etc.)
 *  - Display project metadata
 *  - Allow AI-driven component insertion
 *  - Provide a clean UI surface for the Builder
 */

import React, { useState } from "react";
import { useBuilder } from "./BuilderContext";

export default function Sidebar() {
  const { builderState, actions } = useBuilder();
  const { project, selected } = builderState;

  const [newComponentType, setNewComponentType] = useState("");

  function addComponent() {
    if (!newComponentType.trim()) return;

    const component = {
      id: crypto.randomUUID(),
      type: newComponentType,
      props: {},
      children: []
    };

    actions.addComponent(component);
    setNewComponentType("");
  }

  return (
    <div
      style={{
        width: 260,
        background: "#ffffff",
        borderRight: "1px solid #e5e5e5",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 20
      }}
    >
      {/* Project Info */}
      <div>
        <h3 style={{ margin: 0, fontSize: 18 }}>Project</h3>
        <div style={{ opacity: 0.7, fontSize: 14 }}>
          {project?.name || "Untitled Project"}
        </div>
      </div>

      {/* Add Component */}
      <div>
        <h4 style={{ marginBottom: 8 }}>Add Component</h4>
        <input
          type="text"
          placeholder="Component type (e.g., Text)"
          value={newComponentType}
          onChange={(e) => setNewComponentType(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
            border: "1px solid #ccc",
            borderRadius: 4,
            marginBottom: 8
          }}
        />
        <button
          onClick={addComponent}
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

      {/* Selected Component */}
      <div>
        <h4 style={{ marginBottom: 8 }}>Selected</h4>
        {selected ? (
          <div style={{ fontSize: 14 }}>Component ID: {selected}</div>
        ) : (
          <div style={{ opacity: 0.6, fontSize: 14 }}>None</div>
        )}
      </div>
    </div>
  );
}
