// EditorEngine.js (Structured Base Version)

class EditorEngine {
  constructor() {
    // --- Core Editor State ---
    this.project = null;          // active project data
    this.mode = "design";         // design | preview | inspect
    this.activeTool = null;       // current tool id
    this.activePanel = null;      // current panel id

    // --- Registries (will expand later) ---
    this.tools = {};              // tool registry
    this.panels = {};             // panel registry

    // --- Undo / Redo ---
    this.history = [];
    this.future = [];

    // --- Event Listeners ---
    this.listeners = new Set();
  }

  // --- Project Loading ---
  loadProject(projectData) {
    this.project = projectData;
    this._notify();
  }

  // --- Mode Switching ---
  setMode(mode) {
    this.mode = mode;
    this._notify();
  }

  // --- Tool Selection ---
  selectTool(toolId) {
    this.activeTool = toolId;
    this._notify();
  }

  // --- Panel Control ---
  openPanel(panelId) {
    this.activePanel = panelId;
    this._notify();
  }

  closePanel() {
    this.activePanel = null;
    this._notify();
  }

  // --- Undo / Redo (basic for now) ---
  commit(state) {
    this.history.push(state);
    this.future = [];
  }

  undo() {
    if (this.history.length > 0) {
      const prev = this.history.pop();
      this.future.push(prev);
      this._notify();
    }
  }

  redo() {
    if (this.future.length > 0) {
      const next = this.future.pop();
      this.history.push(next);
      this._notify();
    }
  }

  // --- Event System ---
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  _notify() {
    for (const callback of this.listeners) {
      callback({
        project: this.project,
        mode: this.mode,
        activeTool: this.activeTool,
        activePanel: this.activePanel
      });
    }
  }
}

export default EditorEngine;
