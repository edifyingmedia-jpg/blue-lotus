// frontend/src/Builder/index.js

/**
 * Builder Export Barrel
 * ---------------------------------------------------------
 * Centralizes exports for the Builder subsystem.
 * Allows clean imports like:
 *
 *   import { Builder } from "@/Builder";
 */

import Builder from "./Builder";
import BuilderEngine from "./BuilderEngine";
import ProjectLoader from "./ProjectLoader";
import Sidebar from "./Sidebar";
import Canvas from "./Canvas";
import PropertiesPanel from "./PropertiesPanel";
import ComponentRegistry from "./ComponentRegistry";
import EditorBridge from "./EditorBridge";

export {
  Builder,
  BuilderEngine,
  ProjectLoader,
  Sidebar,
  Canvas,
  PropertiesPanel,
  ComponentRegistry,
  EditorBridge
};
