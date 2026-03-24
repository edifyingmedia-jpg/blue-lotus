/**
 * SceneManager.js
 * ----------------------------------------------------
 * Manages screen scenes, transitions, and nested screen
 * structures. This is a lightweight manager that ensures
 * the correct screen object is passed to RenderScreen.
 *
 * This file replaces the old, overly complex scene logic
 * with a deterministic, synchronous, stable version.
 */

import React from "react";
import RenderScreen from "./RenderScreen";

export default function SceneManager({ scene }) {
  if (!scene) return null;

  // A scene may contain:
  // - a single screen
  // - nested scenes
  // - conditional branches (already resolved upstream)

  const { screen, children } = scene;

  return (
    <>
      {screen && <RenderScreen screen={screen} />}
      {Array.isArray(children) &&
        children.map((child, index) => (
          <SceneManager key={index} scene={child} />
        ))}
    </>
  );
}
