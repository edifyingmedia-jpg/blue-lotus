export class SelectionManager {
  constructor(eventBus, nodeTree) {
    this.eventBus = eventBus;
    this.nodeTree = nodeTree;

    this.selectedNodes = new Set();
    this.lastSelected = null;
  }

  selectNode(nodeId, additive = false) {
    const node = this.nodeTree.findNodeById(nodeId);
    if (!node) return;

    if (!additive) {
      this.clearSelection();
    }

    this.selectedNodes.add(nodeId);
    this.lastSelected = nodeId;

    this.eventBus.emit("selection:changed", {
      selected: Array.from(this.selectedNodes)
    });
  }

  deselectNode(nodeId) {
    if (this.selectedNodes.has(nodeId)) {
      this.selectedNodes.delete(nodeId);

      this.eventBus.emit("selection:changed", {
        selected: Array.from(this.selectedNodes)
      });
    }
  }

  clearSelection() {
    if (this.selectedNodes.size === 0) return;

    this.selectedNodes.clear();
    this.lastSelected = null;

    this.eventBus.emit("selection:changed", {
      selected: []
    });
  }

  isSelected(nodeId) {
    return this.selectedNodes.has(nodeId);
  }

  getSelectedNodes() {
    return Array.from(this.selectedNodes).map((id) =>
      this.nodeTree.findNodeById(id)
    );
  }
}
