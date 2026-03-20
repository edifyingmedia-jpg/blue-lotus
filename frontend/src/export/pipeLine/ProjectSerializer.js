// frontend/src/export/pipeline/ProjectSerializer.js

/**
 * ProjectSerializer
 * ---------------------------------------------------------
 * Converts project metadata into a JSON-safe structure.
 * This is the first step of the export pipeline.
 */

export default class ProjectSerializer {
  static serialize(project) {
    if (!project) {
      return JSON.stringify({ error: "No project data provided" }, null, 2);
    }

    const output = {
      id: project.id || null,
      name: project.name || "Untitled Project",
      createdAt: project.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      screens: project.screens || [],
      components: project.components || [],
      settings: project.settings || {},
      metadata: project.metadata || {}
    };

    return JSON.stringify(output, null, 2);
  }
}
