// frontend/src/runtime/screens/DynamicScreen.jsx

/**
 * DynamicScreen.jsx
 * ---------------------------------------------------------
 * Renders the active screen based on the current route.
 *
 * Responsibilities:
 *  - Read current route from NavigationEngine
 *  - Load the screen's DocumentModel
 *  - Resolve components via ComponentResolver
 *  - Apply runtime data bindings
 *  - Render the UI tree deterministically
 */

import React, { useMemo } from "react";
import NavigationEngine from "../NavigationEngine";
import ScreenLoader from "../ScreenLoader";
import ComponentResolver from "../ComponentResolver";
import useRuntimeDataBindings from "../useRuntimeDataBindings";

export default function DynamicScreen() {
  // Get the active route name
  const routeName = NavigationEngine.getCurrentScreen();

  // Load the DocumentModel for this route
  const documentModel = useMemo(() => {
    return ScreenLoader.load(routeName);
  }, [routeName]);

  if (!documentModel) {
    return (
      <div style={{ padding: 20 }}>
        <strong>Screen not found:</strong> {routeName}
      </div>
    );
  }

  const { components, bindings } = documentModel;

  /**
   * Render a single component node from the DocumentModel.
   * This is recursive — children render their own children.
   */
  const renderNode = (node) => {
    if (!node) return null;

    const { id, type, props = {}, children = [] } = node;

    // Resolve dynamic props ({{state.x}}, {{bindings.y}}, {{actions.z}})
    const resolvedProps = useRuntimeDataBindings(props, bindings);

    // Resolve the actual React component
    const Component = ComponentResolver.resolve(type);

    if (!Component) {
      return (
        <div key={id} style={{ color: "red" }}>
          Unknown component: {type}
        </div>
      );
    }

    return (
      <Component key={id} {...resolvedProps}>
        {children.map((child) => renderNode(child))}
      </Component>
    );
  };

  return <>{components.map((node) => renderNode(node))}</>;
}
