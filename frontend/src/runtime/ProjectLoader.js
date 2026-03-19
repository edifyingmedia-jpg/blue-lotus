// frontend/src/runtime/ProjectLoader.js

/**
 * ProjectLoader.js
 * ----------------
 * Functional project loader for the new Blue Lotus architecture.
 * Handles:
 *   - creating new projects
 *   - loading existing projects
 *   - saving project state
 */

import { Project } from "./DocumentModel";

const STORAGE_KEY = "blue-lotus-project";

/**
 * Create a brand new project with a default scene.
 */
export function createNewProject(name = "Untitled Project") {
  const id = crypto.randomUUID();
  const project = new Project(id, name);

  project.addScene("Main");
  saveProject(project);

  return project;
}

/**
 * Load a project from localStorage.
 */
export function loadProject() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const data = JSON.parse(raw);
    const project = new Project(data.id, data.name);

    // Restore scenes
    for (const s of data.scenes) {
      const scene = project.addScene(s.name);
      scene.id = s.id;
      scene.content = s.content;
      scene.createdAt = s.createdAt;
      scene.updatedAt = s.updatedAt;
    }

    project.metadata = data.metadata;
    project.createdAt = data.createdAt;
    project.updatedAt = data.updatedAt;

    return project;
  } catch (err) {
    console.error("Failed to load project:", err);
    return null;
  }
}

/**
 * Save a project to localStorage.
 */
export function saveProject(project) {
  if (!project) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
}
