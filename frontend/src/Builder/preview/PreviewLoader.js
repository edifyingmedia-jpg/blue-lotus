// frontend/src/Builder/preview/PreviewLoader.js

import React, { useContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import LivePreview from "./LivePreview";
import { AppDefinitionContext } from "../state/AppDefinitionContext";

/**
 * PreviewLoader is responsible for:
 *  - Ensuring the app definition is loaded and valid
 *  - Preparing the data needed by LivePreview
 *  - Surfacing real loading and error states (no placeholders, no mock data)
 *
 * It does NOT:
 *  - Invent project structure
 *  - Simulate components
 *  - Fake data bindings
 *  - Guess at missing configuration
 */
export function PreviewLoader({
  appId,
  initialRoute,
  mode = "preview",
  onEvent,
}) {
  const {
    appDefinition,
    components,
    routes,
    projectMeta,
    isLoading,
    loadError,
    loadAppDefinition,
  } = useContext(AppDefinitionContext);

  const [hasRequestedLoad, setHasRequestedLoad] = useState(false);

  // Ensure the app definition is loaded for this appId
  useEffect(() => {
    if (!appId) return;

    // Only request load once per appId change
    if (!hasRequestedLoad) {
      if (typeof loadAppDefinition === "function") {
        loadAppDefinition(appId);
      }
      setHasRequestedLoad(true);
    }
  }, [appId, hasRequestedLoad, loadAppDefinition]);

  const validationError = useMemo(() => {
    if (!appId) {
      return "PreviewLoader: appId is required.";
    }

    if (loadError) {
      return `PreviewLoader: Failed to load app definition. ${String(loadError)}`;
    }

    if (isLoading) {
      return null;
    }

    if (!appDefinition) {
      return "PreviewLoader: No app definition found for this appId.";
    }

    if (!components || Object.keys(components).length === 0) {
      return "PreviewLoader: No components defined for this app.";
    }

    if (!routes || Object.keys(routes).length === 0) {
      return "PreviewLoader: No routes defined for this app.";
    }

    if (!appDefinition.rootComponentId) {
      return "PreviewLoader: appDefinition.rootComponentId is not set.";
    }

    return null;
  }, [appId, appDefinition, components, routes, isLoading, loadError]);

  if (isLoading || (!hasRequestedLoad && !appDefinition)) {
    return (
      <PreviewLoaderStatus
        status="loading"
        message="Loading preview…"
        details={[
          appId ? `App ID: ${appId}` : "No appId provided.",
          "Fetching app definition, components, and routes.",
        ]}
      />
    );
  }

  if (validationError) {
    return (
      <PreviewLoaderStatus
        status="error"
        message="Unable to render preview."
        details={[validationError]}
      />
    );
  }

  return (
    <LivePreview
      appId={appId}
      initialRoute={initialRoute}
      mode={mode}
      onEvent={onEvent}
    />
  );
}

PreviewLoader.propTypes = {
  appId: PropTypes.string.isRequired,
  initialRoute: PropTypes.string,
  mode: PropTypes.oneOf(["preview", "live"]),
  onEvent: PropTypes.func,
};

/**
 * PreviewLoaderStatus
 * Real, minimal UI for loading and error states.
 * No placeholders, no fake content — just honest status.
 */
function PreviewLoaderStatus({ status, message, details }) {
  const isError = status === "error";
  const isLoading = status === "loading";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "16px",
        boxSizing: "border-box",
        backgroundColor: "#0b1020",
        color: "#f5f7fa",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontWeight: 600,
          fontSize: "14px",
          color: isError ? "#f9703e" : "#3ebd93",
        }}
      >
        {isLoading ? "Preview Loading" : "Preview Status"}
      </div>
      <div style={{ fontSize: "13px", textAlign: "center", maxWidth: 420 }}>
        {message}
      </div>
      {Array.isArray(details) && details.length > 0 && (
        <ul
          style={{
            margin: 0,
            marginTop: "8px",
            paddingLeft: "18px",
            fontSize: "12px",
            opacity: 0.9,
            maxWidth: 480,
            textAlign: "left",
          }}
        >
          {details.map((d, idx) => (
            <li key={idx}>{d}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

PreviewLoaderStatus.propTypes = {
  status: PropTypes.oneOf(["loading", "error"]).isRequired,
  message: PropTypes.string.isRequired,
  details: PropTypes.arrayOf(PropTypes.string),
};

export default PreviewLoader;
