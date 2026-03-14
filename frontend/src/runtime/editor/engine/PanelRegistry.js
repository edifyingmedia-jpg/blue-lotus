// PanelRegistry.js
// Registry for managing editor panels (properties panel, layers panel, etc.)

export default class PanelRegistry {
  constructor() {
    this.panels = {};
    this.activePanel = null;
  }

  // Register a panel with a unique name
  registerPanel(name, panelObject) {
    if (!name || !panelObject) {
      console.error("PanelRegistry: registerPanel requires a name and panelObject");
      return;
    }
    this.panels[name] = panelObject;
  }

  // Retrieve a panel by name
  getPanel(name) {
    return this.panels[name] || null;
  }

  // Set the active panel
  setActivePanel(name) {
    if (!this.panels[name]) {
      console.warn(`PanelRegistry: Panel "${name}" not found`);
      return;
    }
    this.activePanel = name;
  }

  // Get the currently active panel object
  getActivePanel() {
    if (!this.activePanel) return null;
    return this.panels[this.activePanel] || null;
  }

  // List all registered panels
  listPanels() {
    return Object.keys(this.panels);
  }
}
