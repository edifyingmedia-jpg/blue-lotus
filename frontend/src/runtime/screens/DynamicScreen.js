// frontend/src/runtime/screens/DynamicScreen.js

/**
 * DynamicScreen
 * ---------------------------------------------------------
 * Renders all components inside a screen definition.
 * - Loops through component JSON
 * - Resolves each component type
 * - Passes props, params, and actions
 * - Handles unknown components safely
 */

import React from "react";
import resolver from "../resolver/resolverComponents";
import useActionHandler from "../engine/useActionHandler";

export default function DynamicScreen({ components = [], params = {} }) {
  return (
    <>
      {components.map((item, index) => {
        const Component = resolver(item.type);

        if (!Component) {
          return (
            <div key={index} style={{ color: "red", padding: 10 }}>
              Unknown component type: {item.type}
            </div>
          );
        }

        // Prepare action handler
        const onAction = useActionHandler(item.action);

        return (
          <Component
            key={index}
            {...item}
            params={params}
            onAction={onAction}
          />
        );
      })}
    </>
  );
}
