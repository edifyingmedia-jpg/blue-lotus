import React from "react";
import { useNavigation } from "./NavigationEngine";
import { useAppDefinition } from "./AppDefinitionContext";
import resolveComponent from "../components/resolveComponent";

/**
 * Screen
 *
 * Renders a screen definition from the app definition.
 * A screen contains:
 * - id
 * - name
 * - layout (array of component definitions)
 */

export default function Screen({ screen }) {
  const { navigate } = useNavigation();
  const { components } = useAppDefinition();

  if (!screen) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Screen missing</h2>
        <p>No screen definition was provided.</p>
      </div>
    );
  }

  const { layout = [] } = screen;

  return (
    <div style={screenStyle}>
      {layout.map((node, index) => {
        const Component = resolveComponent(node.type);

        if (!Component) {
          return (
            <div key={index} style={{ padding: 10, color: "red" }}>
              Unknown component type: {node.type}
            </div>
          );
        }

        return (
          <Component
            key={index}
            {...node.props}
            navigate={navigate}
            components={components}
          />
        );
      })}
    </div>
  );
}

const screenStyle = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  overflow: "auto",
};
