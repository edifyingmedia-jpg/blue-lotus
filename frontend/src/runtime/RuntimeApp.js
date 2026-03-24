/**
 * RuntimeApp.js
 * ----------------------------------------------------
 * Top-level runtime component.
 *
 * Responsibilities:
 *  - Initialize all runtime engines
 *  - Create the DocumentModel
 *  - Wire StateEngine, ActionEngine, NavigationEngine, Renderer
 *  - Render DynamicScreen as the root UI
 */

import React from "react";

import DocumentModel from "./DocumentModel";
import StateEngine from "./StateEngine";
import ActionEngine from "./ActionEngine";
import NavigationEngine from "./NavigationEngine";
import Renderer from "./Renderer";
import DynamicScreen from "./DynamicScreen";

export default function RuntimeApp({ appDefinition }) {
  if (!appDefinition) {
    throw new Error("RuntimeApp requires an appDefinition");
  }

  // 1. Build the normalized document model
  const documentModel = new DocumentModel(appDefinition);

  // 2. Initialize state
  const stateEngine = new StateEngine(documentModel.getInitialState());

  // 3. Initialize action engine
  const actionEngine = new ActionEngine({
    stateEngine,
    navigationEngine: null, // will be injected after creation
  });

  // 4. Initialize navigation engine
  const navigationEngine = new NavigationEngine({
    documentModel,
    renderer: null, // will be injected after creation
  });

  // Inject circular references
  actionEngine.navigationEngine = navigationEngine;

  // 5. Initialize renderer
  const renderer = new Renderer({
    documentModel,
    stateEngine,
    actionEngine,
    navigationEngine,
  });

  // Inject renderer into navigation engine
  navigationEngine.renderer = renderer;

  // 6. Render the dynamic screen
  return (
    <DynamicScreen
      navigationEngine={navigationEngine}
      renderer={renderer}
    />
  );
}
