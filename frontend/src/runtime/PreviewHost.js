// frontend/src/runtime/PreviewHost.js

import React, { useMemo } from "react";
import LivePreview from "./LivePreview";
import ErrorBoundary from "./ErrorBoundary";
import { validateAppDefinition } from "./AppDefinitionValidator";

/**
 * PreviewHost
 * ---------------------------------------------------------
 * This is the top-level wrapper used by the Builder UI.
 *
 * Responsibilities:
 *  - Accept appDefinition, components, and routes from the builder
 *  - Validate them before rendering
 *  - Wrap the preview in an ErrorBoundary
 *  - Display clean validation errors instead of crashing
 *
 * It does NOT:
 *  - mutate appDefinition
 *  - auto-correct invalid structures
 *  - simulate runtime behavior
 */

export default function PreviewHost({
  appDefinition,
  components,
  routes,
  initialRoute,
  onEvent,
}) {
  // -----------------------------------------------------
  // Validate the incoming definition
  // -----------------------------------------------------
  const validationErrors = useMemo(() => {
    return validateAppDefinition({
      appDefinition,
      components,
      routes,
    });
  }, [appDefinition, components, routes]);

  // -----------------------------------------------------
  // If invalid, show a clean error panel
  // -----------------------------------------------------
  if (validationErrors.length > 0) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: 16,
          boxSizing: "border-box",
          backgroundColor: "#020617",
          color: "#e5e7eb",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontSize: 13,
          overflowY: "auto",
        }}
      >
        <strong>App Definition Errors</strong>
        <ul style={{ marginTop: 8, paddingLeft: 20 }}>
          {validationErrors.map((err, i) => (
            <li key={i} style={{ marginBottom: 4 }}>
              {err}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // -----------------------------------------------------
  // Render the preview safely
  // -----------------------------------------------------
  return (
    <ErrorBoundary
      onError={(err) => {
        if (onEvent) {
          onEvent({
            type: "runtimeError",
            payload: err,
          });
        }
      }}
    >
      <LivePreview
        appDefinition={appDefinition}
        components={components}
        routes={routes}
        initialRoute={initialRoute}
        onEvent={onEvent}
      />
    </ErrorBoundary>
  );
}
