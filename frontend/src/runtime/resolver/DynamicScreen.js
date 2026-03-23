// frontend/src/runtime/resolver/DynamicScreen.js

/**
 * DynamicScreen.js
 * ---------------------------------------------------------
 * Resolves and renders the component tree for the active screen.
 *
 * Responsibilities:
 *  - Load the screen's DocumentModel
 *  - Resolve the root component via ComponentResolver
 *  - Apply runtime bindings (props, state, actions)
 *  - Return a fully rendered React tree
 */

import React from "react";
import DocumentModel from "../DocumentModel";
import ComponentResolver from "../ComponentResolver";
import resolveProps from "../resolveProps";
import useRuntimeDataBindings from "../useRuntimeDataBindings";
import { useScreen } from "../screens/ScreenContext";

export default function DynamicScreen() {
  const screen = useScreen();

  if (!screen?.name) {
    console.warn("[DynamicScreen] No active screen in context.");
    return null;
  }

  // Load the DocumentModel for this screen
  const model = DocumentModel.load(screen.name);

  if (!model) {
    console.error(`[DynamicScreen] DocumentModel not found for: ${screen.name}`);
    return (
      <div style={{ padding: 20, color: "red" }}>
        Screen not found: {screen.name}
      </div>
    );
  }

  const resolver = new ComponentResolver();
  const bindings = useRuntimeDataBindings(model.bindings || {});

  // Resolve the root component
  const rootId = model.root;
  if (!rootId) {
    console.error(`[DynamicScreen] No root component defined for: ${screen.name}`);
    return null;
  }

  const rootComponent = model.components[rootId];
  if (!rootComponent) {
    console.error(
      `[DynamicScreen] Root component ${rootId} missing in DocumentModel for: ${screen.name}`
    );
    return null;
  }

  // Resolve props with bindings
  const resolvedProps = resolveProps(rootComponent.props || {}, bindings);

  // Build the component tree
  const tree = resolver.resolve(rootComponent.type, resolvedProps, model);

  return (
    <div
      className="bl-dynamic-screen"
      data-screen={screen.name}
      style={{ width: "100%", height: "100%" }}
    >
      {tree}
    </div>
  );
}
