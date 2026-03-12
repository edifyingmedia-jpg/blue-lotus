import React from "react";
import { AppDefinitionProvider } from "./AppDefinitionContext";
import { NavigationProvider } from "./NavigationEngine";

export default function LivePreview({ app }) {
  if (!app) return <div>No app loaded.</div>;

  return (
    <AppDefinitionProvider app={app}>
      <NavigationProvider app={app}>
        {/* The actual app UI will render inside NavigationProvider */}
      </NavigationProvider>
    </AppDefinitionProvider>
  );
}
