// frontend/src/runtime/ComponentResolver.js

import React, { useMemo } from "react";
import PropTypes from "prop-types";

/**
 * ComponentResolver
 *
 * This is the core runtime tree resolver.
 * It:
 *  - Takes a components map and a rootComponentId from appDefinition
 *  - Recursively renders the component tree
 *  - Maps abstract component types to real DOM elements
 *
 * It does NOT:
 *  - Invent components
 *  - Provide mock data
 *  - Simulate behavior
 */
export function ComponentResolver({
  appDefinition,
  components,
  routes,
  initialRoute,
  mode = "preview",
  onEvent,
}) {
  const rootId = appDefinition?.rootComponentId;

  const validationError = useMemo(() => {
    if (!appDefinition) return "ComponentResolver: appDefinition is required.";
    if (!rootId) return "ComponentResolver: appDefinition.rootComponentId is not set.";
    if (!components || Object.keys(components).length === 0) {
      return "ComponentResolver: components map is empty or missing.";
    }
    return null;
  }, [appDefinition, rootId, components]);

  const handleEvent = (eventName, payload, node) => {
    if (typeof onEvent === "function") {
      onEvent({
        type: eventName,
        payload,
        nodeId: node.id,
        mode,
      });
    }
  };

  const resolveElementType = (node) => {
    const type = node.type;

    if (!type) return "div";

    switch (type) {
      case "View":
      case "Container":
      case "Screen":
        return "div";
      case "Text":
      case "Label":
        return "span";
      case "Image":
        return "img";
      case "Button":
        return "button";
      default:
        // Fallback to a div for unknown types
        return "div";
    }
  };

  const renderNode = (nodeId) => {
    const node = components[nodeId];
    if (!node) return null;

    const ElementType = resolveElementType(node);
    const { children = [], props = {} } = node;

    const domProps = { ...props };

    // Basic event wiring (non-simulated, just forwarding if present)
    if (props.onClick) {
      domProps.onClick = (e) => {
        props.onClick(e);
        handleEvent("click", { event: e }, node);
      };
    }

    if (props.onPress) {
      domProps.onClick = (e) => {
        props.onPress(e);
        handleEvent("press", { event: e }, node);
      };
    }

    // Ensure img has alt
    if (ElementType === "img" && !domProps.alt) {
      domProps.alt = props.alt || "";
    }

    return (
      <ElementType key={nodeId} {...domProps}>
        {children.map((childId) => renderNode(childId))}
      </ElementType>
    );
  };

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

  return renderNode(rootId);
}

ComponentResolver.propTypes = {
  appDefinition: PropTypes.shape({
    rootComponentId: PropTypes.string,
  }),
  components: PropTypes.object.isRequired,
  routes: PropTypes.object,
  initialRoute: PropTypes.string,
  mode: PropTypes.oneOf(["preview", "live"]),
  onEvent: PropTypes.func,
};

export default ComponentResolver;
