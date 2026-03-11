import React from "react";
import RenderScreen from "../runtime/RenderScreen";
import Layout from "../runtime/Layout";

/**
 * ScreenPage
 * ----------
 * A universal wrapper that renders any screen JSON using the runtime engine.
 * Now wrapped in the global Layout component for consistent styling.
 */

export default function ScreenPage({ screen }) {
  if (!screen) {
    return (
      <Layout>
        <div style={{ padding: 20, color: "red" }}>
          <strong>No screen data provided.</strong>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      showNav={screen.layout?.showNav ?? true}
      navProps={screen.layout?.navProps ?? {}}
    >
      <RenderScreen screen={screen} />
    </Layout>
  );
}
