/**
 * ProjectLoader.js
 * ----------------------------------------------------
 * Loads, normalizes, and prepares project definitions
 * before they enter the runtime or LivePreview.
 *
 * Responsibilities:
 *  - Accept raw project JSON
 *  - Normalize structure
 *  - Ensure required fields exist
 *  - Deep clone to avoid mutation
 *  - Return a clean, runtime-ready definition
 *
 * Non‑Responsibilities:
 *  - Validation (handled by AppDefinitionValidator)
 *  - Rendering
 *  - State management
 *  - Navigation
 */

import { deepClone } from "./utils";

export default class ProjectLoader {
  /**
   * Load a raw project definition and normalize it.
   */
  static load(raw) {
    if (!raw || typeof raw !== "object") {
      throw new Error("ProjectLoader.load requires a project object");
    }

    // Clone to avoid mutating caller data
    const project = deepClone(raw);

    // Ensure required top-level fields
    if (!project.screens || typeof project.screens !== "object") {
      project.screens = {};
    }

    if (!project.theme || typeof project.theme !== "object") {
      project.theme = {};
    }

    if (!project.navigation || typeof project.navigation !== "object") {
      project.navigation = {};
    }

    if (!project.state || typeof project.state !== "object") {
      project.state = {};
    }

    // Normalize screens
    for (const key of Object.keys(project.screens)) {
      const screen = project.screens[key];

      if (!screen || typeof screen !== "object") {
        project.screens[key] = {};
        continue;
      }

      if (!screen.components || !Array.isArray(screen.components)) {
        screen.components = [];
      }

      if (!screen.layout || typeof screen.layout !== "object") {
        screen.layout = {};
      }
    }

    return project;
  }
}
