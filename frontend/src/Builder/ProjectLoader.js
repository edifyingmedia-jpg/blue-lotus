// frontend/src/Builder/ProjectLoader.js

/**
 * ProjectLoader
 * ---------------------------------------------------------
 * Loads a project JSON structure into the Builder.
 * Ensures screens, component trees, and metadata are valid.
 */

import { v4 as uuid } from "uuid";

export default class ProjectLoader {
  /**
   * Normalize and load a project into BuilderState.
   */
  static load(rawProject) {
    if (!rawProject) {
      console.warn("ProjectLoader: No project provided.");
      return null;
    }

    const project = { ...rawProject };

    // Ensure screens exist
    if (!project.screens || typeof project.screens !== "object") {
      project.screens = {};
    }

    // Normalize each screen
    for (const id of Object.keys(project.screens)) {
      const screen = project.screens[id];

      // Ensure screen has an ID
      if (!screen.id) screen.id = id;

      // Ensure screen has a name
      if (!screen.name) screen.name = `Screen ${id}`;

      // Ensure screen has a root component
      if (!screen.root) {
        screen.root = {
          id: uuid(),
          type: "Container",
          props: {},
          children: [],
        };
      }
    }

    // Pick a default screen
    const screenIds = Object.keys(project.screens);
    project.currentScreen = project.currentScreen || screenIds[0] || null;

    return project;
  }
}
