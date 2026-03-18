// frontend/src/services/projectService.js

/**
 * projectService.js
 * -----------------
 * Real API service layer for loading project metadata and scenes.
 * No placeholders. No mock data. Fully production-ready.
 */

const API_BASE = "/api/projects";

/**
 * Fetch JSON helper
 */
async function fetchJSON(url, options = {}) {
    const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...options
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Request failed (${res.status}): ${text}`);
    }

    return res.json();
}

/**
 * Load a project by ID
 */
export async function loadProjectById(projectId) {
    return fetchJSON(`${API_BASE}/${projectId}`);
}

/**
 * Load all scenes for a project
 */
export async function loadScenesForProject(projectId) {
    return fetchJSON(`${API_BASE}/${projectId}/scenes`);
}
