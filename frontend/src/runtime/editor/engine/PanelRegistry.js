export class PanelRegistry {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.panels = new Map();
    this.activePanel = null;
  }

  registerPanel(name, panelInstance) {
    this.panels.set(name, panelInstance);
  }

  activatePanel(name) {
    const panel = this.panels.get(name);
    if (!panel) {
      console.warn(`Panel not found: ${name}`);
      return;
    }

    this.activePanel = panel;

    if (panel.onActivate) {
      panel.onActivate();
    }

    this.eventBus.emit("panel:activated", { name });
  }

  deactivatePanel() {
    if (this.activePanel && this.activePanel.onDeactivate) {
      this.activePanel.onDeactivate();
    }

    this.activePanel = null;
    this.eventBus.emit("panel:deactivated", {});
  }

  updatePanel(name, data) {
    const panel = this.panels.get(name);
    if (!panel || !panel.update) return;

    panel.update(data);
    this.eventBus.emit("panel:updated", { name, data });
  }
}
