// frontend/src/runtime/resolveComponent.js

/**
 * resolveComponent
 *
 * This function maps a component "type" string from the appDefinition
 * to a real React component implementation.
 *
 * It is intentionally minimal and deterministic:
 *  - No placeholders
 *  - No mock components
 *  - No simulation
 *
 * Blue Lotus components must be explicitly registered here or
 * injected via a registry in the future.
 */

import React from "react";

// Core built‑in runtime components
import BLView from "../components/BLView";
import BLText from "../components/BLText";
import BLImage from "../components/BLImage";
import BLButton from "../components/BLButton";

/**
 * Component registry
 *
 * This is the authoritative mapping of component types → React components.
 * Every real component Blue Lotus supports must be registered here.
 */
const registry = {
  View: BLView,
  Container: BLView,
  Screen: BLView,

  Text: BLText,
  Label: BLText,

  Image: BLImage,

  Button: BLButton,
};

/**
 * resolveComponent(type)
 *
 * Returns the actual React component for a given type string.
 * If the type is unknown, it falls back to a safe <div>.
 */
export default function resolveComponent(type) {
  if (!type) return "div";

  const Component = registry[type];

  if (!Component) {
    console.warn(`resolveComponent: Unknown component type "${type}". Falling back to <div>.`);
    return "div";
  }

  return Component;
}
