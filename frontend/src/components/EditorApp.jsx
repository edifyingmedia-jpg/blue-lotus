/**
 * EditorApp.jsx
 * Blue Lotus — AI‑Driven No‑Code Builder
 *
 * Root UI for the editor. Now powered by the Builder engine.
 */

import React, { useEffect, useState } from "react";
import { initializeEditorBridge } from "../Builder/EditorBridge";

import EditorLayout from "./EditorLayout";
import SceneList from "./SceneList";
import SceneEditor from "./SceneEditor";
import Toolbar from "./Toolbar";
import StatusStrip from "./StatusStrip";

export default function EditorApp({ project }) {
  const [api, setApi] = useState(null);

  useEffect(() => {
    async function init() {
      const engine = await initializeEditorBridge(project);
      setApi(engine);
    }
    init();
  }, [project]);

  if (!api) {
    return <div style={{ padding: 20 }}>Loading Blue Lotus Builder…</div>;
  }

  const state = api.getState();
  const scenes = api.getScenes();
  const currentScene = api.getCurrentScene();

  return (
    <EditorLayout>
      <Toolbar dispatch={api.dispatch} />

      <div className="editor-main">
        <SceneList
          scenes={scenes}
          currentScene={currentScene}
          dispatch={api.dispatch}
        />

        <SceneEditor
          scene={currentScene}
          state={state}
          dispatch={api.dispatch}
        />
      </div>

      <StatusStrip state={state} />
    </EditorLayout>
  );
}
