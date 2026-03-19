// frontend/src/runtime/engine/DynamicScreen.js

import React from "react";
import resolveComponent from "./resolveComponent";
import useActionHandler from "./useActionHandler";

/**
 * DynamicScreen
 * ---------------------------------------------------------
 * Renders a screen's component list.
 * - Resolves component types
 * - Passes props + params
 * - Wires action handlers
 */

export default function DynamicScreen({ components = [], params = {}, dispatch }) {
  return (
    <>
      {components.map((item, index) => {
        const Component = resolveComponent(item.type);

        if (!Component) {
          return (
            <div key={index} style={{ color: "red", padding: 10 }}>
              Unknown component type: {item.type}
            </div>
          );
        }

        // Create action handler for this component
        const onAction = useActionHandler(dispatch);

        return (
          <Component
            key={index}
            {...item.props}
            params={params}
            onAction={onAction}
          />
        );
      })}
    </>
  );
}
