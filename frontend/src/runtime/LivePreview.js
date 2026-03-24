import React, { useEffect, useRef, useState } from "react";
import PreviewHost from "./PreviewHost";
import RuntimeRenderer from "./RuntimeRenderer";
import EventBus from "./EventBus";
import ErrorBoundary from "./ErrorBoundary";

/**
 * LivePreview
 * -----------------------------------------
 * The real-time preview engine for Blue Lotus.
 * 
 * Responsibilities:
 * - Mount a PreviewHost instance
 * - Render the current app definition using RuntimeRenderer
 * - Listen for builder updates via EventBus
 * - Re-render deterministically on every change
 * - Provide error isolation via ErrorBoundary
 */

export default function LivePreview({ appDefinition, initialScreen }) {
  const hostRef = useRef(null);
  const rendererRef = useRef(null);

  const [currentDefinition, setCurrentDefinition] = useState(appDefinition);
  const [currentScreen, setCurrentScreen] = useState(initialScreen);

  // Initialize PreviewHost + RuntimeRenderer
  useEffect(() => {
    if (!hostRef.current) {
      hostRef.current = new PreviewHost();
    }

    if (!rendererRef.current) {
      rendererRef.current = new RuntimeRenderer({
        host: hostRef.current,
        onNavigate: (screenId) => setCurrentScreen(screenId),
      });
    }

    rendererRef.current.loadApp(currentDefinition, currentScreen);
  }, []);

  // Listen for app definition updates from the Builder
  useEffect(() => {
    const unsub = EventBus.subscribe("app:update", (updatedDefinition) => {
      setCurrentDefinition(updatedDefinition);
      rendererRef.current.loadApp(updatedDefinition, currentScreen);
    });

    return () => unsub();
  }, [currentScreen]);

  // Listen for navigation events
  useEffect(() => {
    const unsub = EventBus.subscribe("preview:navigate", (screenId) => {
      setCurrentScreen(screenId);
      rendererRef.current.navigate(screenId);
    });

    return () => unsub();
  }, []);

  return (
    <div className="live-preview-container">
      <ErrorBoundary>
        <div id="preview-root">
          {rendererRef.current
            ? rendererRef.current.render()
            : "Initializing preview..."}
        </div>
      </ErrorBoundary>
    </div>
  );
}
