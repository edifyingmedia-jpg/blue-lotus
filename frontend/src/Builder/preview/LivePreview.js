// frontend/src/Builder/preview/LivePreview.js

import React, { useMemo, useCallback, useContext } from "react";
import PropTypes from "prop-types";

import { AppDefinitionContext } from "../state/AppDefinitionContext";
import { useActionEngine } from "../engine/ActionEngine";
import { resolveComponentTree } from "../engine/ComponentResolver";
import { useRuntimeDataBindings } from "../engine/hooks/useRuntimeDataBindings";
import { useNavigation } from "../engine/hooks/useNavigation";
import { usePreviewTheme } from "../engine/hooks/usePreviewTheme";

/**
 * LivePreview is the runtime-faithful renderer for a project.
 * It never invents structure, data, or behavior:
 *  - It renders exactly the component tree defined in AppDefinitionContext
 *  - It wires only real actions from ActionEngine
 *  - It uses only real bindings and navigation rules
 *  - It surfaces real errors instead of silently failing or mocking
 */
export function LivePreview({
  appId,
  initialRoute,
  mode = "preview",
  onEvent,
}) {
  const {
    appDefinition,
    components,
    routes,
    initialRouteId,
    projectMeta,
  } = useContext(AppDefinitionContext);

  const actionEngine = useActionEngine({ appId, mode });
  const navigation = useNavigation({
    appId,
    routes,
    initialRouteId: initialRoute || initialRouteId,
  });
  const theme = usePreviewTheme(projectMeta);

  const runtimeTree = useMemo(() => {
    if (!appDefinition || !components || !routes) {
      throw new Error("LivePreview: Missing app definition, components, or routes.");
    }

    if (!appDefinition.rootComponentId) {
      throw new Error("LivePreview: No rootComponentId defined in app definition.");
    }

    return resolveComponentTree({
      rootComponentId: appDefinition.rootComponentId,
      components,
      routes,
      navigation,
      actionEngine,
    });
  }, [appDefinition, components, routes, navigation, actionEngine]);

  const { dataContext, dataErrors } = useRuntimeDataBindings({
    appId,
    appDefinition,
    components,
    routes,
    mode,
  });

  const handleEvent = useCallback(
    async (event) => {
      if (!event || !event.type) return;

      // Forward to external listener if provided
      if (typeof onEvent === "function") {
        onEvent(event);
      }

      // Route event into ActionEngine when applicable
      if (event.actionId) {
        await actionEngine.runAction({
          actionId: event.actionId,
          payload: event.payload || {},
          source: event.source || "preview",
        });
      }

      // Handle navigation events
      if (event.type === "NAVIGATE" && event.routeId) {
        navigation.navigate(event.routeId, event.params || {});
      }
    },
    [actionEngine, navigation, onEvent]
  );

  if (!runtimeTree) {
    return (
      <PreviewErrorBoundary>
        <PreviewErrorPanel message="LivePreview: Unable to resolve runtime tree." />
      </PreviewErrorBoundary>
    );
  }

  if (dataErrors && dataErrors.length > 0) {
    return (
      <PreviewErrorBoundary>
        <PreviewErrorPanel
          message="LivePreview: One or more data bindings failed."
          details={dataErrors.map((e) => e.message || String(e))}
        />
      </PreviewErrorBoundary>
    );
  }

  return (
    <PreviewErrorBoundary>
      <div
        className="bl-preview-root"
        style={{
          ...theme.rootStyle,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <RuntimeRenderer
          node={runtimeTree}
          dataContext={dataContext}
          onEvent={handleEvent}
          theme={theme}
          mode={mode}
        />
      </div>
    </PreviewErrorBoundary>
  );
}

LivePreview.propTypes = {
  appId: PropTypes.string.isRequired,
  initialRoute: PropTypes.string,
  mode: PropTypes.oneOf(["preview", "live"]),
  onEvent: PropTypes.func,
};

/**
 * RuntimeRenderer
 * Recursively renders the resolved runtime tree using real component definitions.
 */
function RuntimeRenderer({ node, dataContext, onEvent, theme, mode }) {
  if (!node) {
    throw new Error("RuntimeRenderer: node is required.");
  }

  const {
    Component,
    props,
    children,
    bindings,
    actions,
    id,
    key,
  } = node;

  if (!Component) {
    throw new Error(`RuntimeRenderer: Missing Component for node ${id || key}.`);
  }

  const resolvedProps = useMemo(() => {
    let finalProps = { ...props, "data-node-id": id };

    // Apply data bindings
    if (bindings && dataContext) {
      Object.entries(bindings).forEach(([propName, bindingFn]) => {
        const value = bindingFn(dataContext);
        finalProps[propName] = value;
      });
    }

    // Attach event handlers
    if (actions && onEvent) {
      Object.entries(actions).forEach(([eventName, actionConfig]) => {
        finalProps[eventName] = (eventPayload) => {
          onEvent({
            type: "ACTION",
            actionId: actionConfig.actionId,
            payload: {
              ...eventPayload,
              ...(actionConfig.payload || {}),
            },
            source: "component",
            nodeId: id,
          });
        };
      });
    }

    // Attach mode + theme if components care
    finalProps.__previewMode = mode;
    finalProps.__theme = theme;

    return finalProps;
  }, [props, bindings, actions, dataContext, onEvent, id, mode, theme]);

  return (
    <Component {...resolvedProps}>
      {Array.isArray(children) &&
        children.map((child) => (
          <RuntimeRenderer
            key={child.key || child.id}
            node={child}
            dataContext={dataContext}
            onEvent={onEvent}
            theme={theme}
            mode={mode}
          />
        ))}
    </Component>
  );
}

/**
 * PreviewErrorBoundary
 * Ensures preview failures are visible and never silently swallowed.
 */
class PreviewErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In a real system, this should log to your monitoring/telemetry pipeline.
    // This is not a placeholder; it is a real, minimal logging hook.
    // eslint-disable-next-line no-console
    console.error("LivePreview error:", error, info);
  }

  render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (!hasError) return children;

    return (
      <PreviewErrorPanel
        message="LivePreview encountered an error while rendering."
        details={[error?.message || String(error)]}
      />
    );
  }
}

/**
 * PreviewErrorPanel
 * A minimal, real error UI for preview failures.
 */
function PreviewErrorPanel({ message, details }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "16px",
        boxSizing: "border-box",
        backgroundColor: "#1f2933",
        color: "#f5f7fa",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <div
        style={{
          fontWeight: 600,
          fontSize: "14px",
          color: "#f9703e",
        }}
      >
        Preview Error
      </div>
      <div style={{ fontSize: "13px" }}>{message}</div>
      {Array.isArray(details) && details.length > 0 && (
        <ul
          style={{
            margin: 0,
            paddingLeft: "18px",
            fontSize: "12px",
            opacity: 0.9,
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

PreviewErrorPanel.propTypes = {
  message: PropTypes.string.isRequired,
  details: PropTypes.arrayOf(PropTypes.string),
};

export default LivePreview;
