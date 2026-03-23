import React, { useState } from "react";

export default function NavigationEditor() {
  const [routes, setRoutes] = useState([]);
  const [newRoute, setNewRoute] = useState("");

  const addRoute = () => {
    if (!newRoute.trim()) return;
    setRoutes([...routes, { path: newRoute }]);
    setNewRoute("");
  };

  return (
    <div className="panel navigation-editor">
      <h2>Navigation Editor</h2>

      <div className="editor-section">
        <input
          type="text"
          placeholder="New route path (e.g. /home)"
          value={newRoute}
          onChange={(e) => setNewRoute(e.target.value)}
        />
        <button onClick={addRoute}>Add Route</button>
      </div>

      <div className="editor-section">
        <h3>Existing Routes</h3>
        {routes.length === 0 && <p>No routes yet.</p>}
        <ul>
          {routes.map((route, index) => (
            <li key={index}>{route.path}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
