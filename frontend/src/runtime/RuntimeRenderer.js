// frontend/src/runtime/RuntimeRenderer.js

import React, { useMemo } from "react";
import PropTypes from "prop-types";

import ComponentResolver from "./ComponentResolver";

/**
 * RuntimeRenderer
 *
 * This is the engine-level renderer that LivePreview delegates to.
 * It is responsible for:
 *  - Taking a real appDefinition, components, and routes
 *  - Validating that a root component exists
 *  - Delegating actual tree construction to ComponentResolver
 *
 * It does NOT:
 *  - Invent components
 *  - Provide mock data
 *  - Simulate routes
 *  - Fake bindings or actions
 */
export function RuntimeRenderer({
  appDefinition,
  components,
  routes,
  initialRoute,
  mode = "preview",
  onEvent,
}) {
  const validationError = useMemo(() => {
    if (!appDefinition) {
      return "RuntimeRenderer: appDefinition is required.";
    }

    if (!appDefinition.rootComponentId) {
      return "RuntimeRenderer: appDefinition.rootComponentId is not set.";
    }

    if (!components || Object.keys(components).length === 0) {
      return "RuntimeRenderer: components map is empty or missing.";
    }

    if (!routes || Object.keys(routes).length === 0) {
      return "RuntimeRenderer: routes map is empty or missing.";
    }

    return null;
  }, [appDefinition, components, routes]);

  if (validationError) {
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontSize: 13,
        }}
      >
        {validationError}
      </div>
    );
  }

  return (
    <ComponentResolver
      appDefinition={appDefinition}
      components={components}
      routes={routes}
      initialRoute={initialRoute}
      mode={mode}
      onEvent={onEvent}
    />
  );
}

RuntimeRenderer.propTypes = {
  appDefinition: PropTypes.object,
  components: PropTypes.object,
  routes: PropTypes.object,
  initialRoute: PropTypes.string,
  mode: PropTypes.oneOf(["preview", "live"]),
  onEvent: PropTypes.func,
};

export default RuntimeRenderer;
