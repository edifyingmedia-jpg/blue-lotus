// ScreenRenderer.jsx
// Renders a screen by ID using your JSON-defined screens and component resolver

import React from "react";
import screens from "./screens";
import resolveComponent from "./components/resolveComponent";

// Import the Editor context wrapper
import { EditorProvider } from "./editor/EditorContext";

export default function ScreenRenderer({ screenId, navigation, engine }) {
  const screen = screens[screenId];

  if (!screen) {
    return (
      <div style={styles.error}>
        <h2>Screen not found</h2>
        <p>{screenId}</p>
      </div>
    );
  }

  const content = (
    <div style={styles.container}>
      {screen.components?.map((component, index) => {
        const Component = resolveComponent(component.type);
        if (!Component) return null;

        return (
          <Component
            key={index}
            {...component}
            navigation={navigation}
            engine={engine}
          />
        );
      })}
    </div>
  );

  // Wrap the Editor screen in the EditorProvider
  if (screenId === "Editor") {
    return <EditorProvider>{content}</EditorProvider>;
  }

  return content;
}

const styles = {
  container: {
    width: "100%",
    height: "100%",
    overflowY: "auto",
    boxSizing: "border-box",
  },
  error: {
    padding: 20,
    color: "white",
    background: "red",
  },
};
