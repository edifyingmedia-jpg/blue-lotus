import React, { useState } from "react";

export default function ComponentEditor() {
  const [components, setComponents] = useState([]);
  const [newComponentName, setNewComponentName] = useState("");

  const addComponent = () => {
    if (!newComponentName.trim()) return;
    setComponents([...components, { name: newComponentName }]);
    setNewComponentName("");
  };

  return (
    <div className="panel component-editor">
      <h2>Component Editor</h2>

      <div className="editor-section">
        <input
          type="text"
          placeholder="New component name"
          value={newComponentName}
          onChange={(e) => setNewComponentName(e.target.value)}
        />
        <button onClick={addComponent}>Add Component</button>
      </div>

      <div className="editor-section">
        <h3>Existing Components</h3>
        {components.length === 0 && <p>No components yet.</p>}
        <ul>
          {components.map((component, index) => (
            <li key={index}>{component.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
