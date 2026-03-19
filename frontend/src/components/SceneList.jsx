/**
 * SceneList.jsx
 * Displays all scenes and allows switching between them.
 */

import React from "react";

export default function SceneList({ scenes, currentScene, dispatch }) {
  if (!scenes || scenes.length === 0) {
    return (
      <div className="scene-list">
        <div className="scene-list-empty">No scenes yet</div>
      </div>
    );
  }

  return (
    <div className="scene-list">
      {scenes.map((scene) => {
        const isActive = currentScene && currentScene.id === scene.id;

        return (
          <div
            key={scene.id}
            className={`scene-list-item ${isActive ? "active" : ""}`}
            onClick={() =>
              dispatch({
                type: "SWITCH_SCENE",
                payload: { sceneId: scene.id },
              })
            }
          >
            {scene.name || `Scene ${scene.id}`}
          </div>
        );
      })}
    </div>
  );
}
