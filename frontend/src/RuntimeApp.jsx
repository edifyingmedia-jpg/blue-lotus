import React, { useEffect, useState, useRef } from "react";
import RuntimeEngine from "./runtime/RuntimeEngine";
import EventBus from "./runtime/EventBus";
import LoadScreen from "./runtime/LoadScreen";

export default function RuntimeApp({ appDefinition }) {
  const engineRef = useRef(null);
  const [output, setOutput] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    engineRef.current = new RuntimeEngine({
      onRender: (html) => setOutput(html),
    });

    engineRef.current.load(appDefinition);
    setReady(true);

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
