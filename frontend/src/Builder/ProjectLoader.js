// frontend/src/Builder/ProjectLoader.js

/**
 * ProjectLoader
 * ---------------------------------------------------------
 * Loads a project into the Builder Engine.
 *
 * Responsibilities:
 *  - Accept a project object (from storage, API, or export)
 *  - Initialize builder state (project + components)
 *  - Ensure the builder is ready before rendering children
 */

import React, { useEffect } from "react";
import { useBuilder } from "./BuilderContext";

export default function ProjectLoader({ project, children }) {
  const { actions } = useBuilder();

  useEffect(() => {
    if (!project) return;

    // Load project metadata
    actions.setProject({
      id: project.id,
      name: project.name || "Untitled Project",
      createdAt: project.createdAt || null,
      updatedAt: project.updatedAt || null,
      version: project.version || 1
    });

    // Load component tree
    if (Array.isArray(project.components)) {
      actions.setComponents(project.components);
    }
  }, [project]);

  return <>{children}</>;
}
