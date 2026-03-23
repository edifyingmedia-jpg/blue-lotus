import React, { useState } from "react";

export default function ScreenEditor() {
  const [screens, setScreens] = useState([]);
  const [newScreenName, setNewScreenName] = useState("");

  const addScreen = () => {
    if (!newScreenName.trim()) return;
    setScreens([...screens, { name: newScreenName }]);
    setNewScreenName("");
  };

  return (
    <div className="panel screen-editor">
      <h2>Screen Editor</h2>

      <div className="editor-section">
        <input
          type="text"
          placeholder="New screen name"
          value={newScreenName}
          onChange={(e) => setNewScreenName(e.target.value)}
        />
        <button onClick={addScreen}>Add Screen</button>
      </div>

      <div className="editor-section">
        <h3>Existing Screens</h3>
        {screens.length === 0 && <p>No screens yet.</p>}
        <ul>
          {screens.map((screen, index) => (
            <li key={index}>{screen.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
