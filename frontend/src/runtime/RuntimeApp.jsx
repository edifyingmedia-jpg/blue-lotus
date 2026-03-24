import React, { useEffect, useState, useRef } from "react";
import RuntimeEngine from "./RuntimeEngine";
import EventBus from "./EventBus";
import LoadScreen from "./LoadScreen";

/**
 * RuntimeApp
 * ----------------------------------------------------
 * React wrapper around the RuntimeEngine.
 *
 * Responsibilities:
 * - Initialize the runtime engine
 * - Load the app definition
 * - Listen for builder updates
 * - Render the active screen output
 */

export default function RuntimeApp({ appDefinition }) {
  const engineRef = useRef(null);
  const [output, setOutput] = useState(null);
  const [ready, setReady] = useState(false);

  // Initialize runtime engine
  useEffect(() => {
    engineRef.current = new RuntimeEngine({
      onRender: (html) => setOutput(html),
    });

    engineRef.current.load(appDefinition);
    setReady(true);

    // Listen for builder updates
    const unsub = EventBus.subscribe("app:update", (updatedDef) => {
      engineRef.current.load(updatedDef);
    });

    return () => unsub();
  }, []);

  if (!ready) {
    return <LoadScreen message="Initializing runtime..." />;
  }

  return (
    <div
      className="runtime-app-container"
      style={{ width: "100%", height: "100%" }}
      dangerouslySetInnerHTML={{ __html: output }}
    />
  );
}
