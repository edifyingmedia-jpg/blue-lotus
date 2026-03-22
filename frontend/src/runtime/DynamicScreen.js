// frontend/src/runtime/DynamicScreen.js

/**
 * DynamicScreen
 * ---------------------------------------------------------
 * A runtime wrapper that renders a screen based on the
 * current route. It resolves the root component for the
 * route and builds the component tree using ComponentResolver.
 *
 * Responsibilities:
 *  - Accept a routeName
 *  - Resolve the root component ID via DocumentModel
 *  - Build the component tree via ComponentResolver
 *  - Render the resolved tree inside a stable wrapper
 */

import React from "react";
import DocumentModel from "./DocumentModel";
import ComponentResolver from "./ComponentResolver";

export default function DynamicScreen({
  appDefinition,
  routeName,
  state,
  dispatcher,
}) {
  if (!appDefinition || !routeName) {
    console.warn("[DynamicScreen] Missing appDefinition or routeName");
    return null;
  }

  // Initialize document + resolver
  const documentModel = new DocumentModel(appDefinition);
  const resolver = new ComponentResolver({
    appDefinition,
    state,
    dispatcher,
  });

  // Get root component for this route
  const rootId = documentModel.getRootComponentForRoute(routeName);

  if (!rootId) {
    console.warn(`[DynamicScreen] No root component for route: ${routeName}`);
    return null;
  }

  // Resolve the component tree
  const tree = resolver.resolveById(rootId);

  return (
    <div className="bl-dynamic-screen" data-route={routeName}>
      {tree}
    </div>
  );
}
