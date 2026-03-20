// frontend/src/runtime/screens/index.js

/**
 * Runtime Screens Export Barrel
 * ---------------------------------------------------------
 * Centralizes exports for the runtime/screens subsystem.
 *
 * Allows clean imports like:
 *
 *   import { ScreenRenderer, SceneManager } from "@/runtime/screens";
 */

import ScreenContext, { useScreen } from "./ScreenContext";
import ScreenRenderer from "./ScreenRenderer";
import SceneManager from "./SceneManager";
import useNavigation from "./NavigationEngine";

export {
  ScreenContext,
  useScreen,
  ScreenRenderer,
  SceneManager,
  useNavigation,
};
