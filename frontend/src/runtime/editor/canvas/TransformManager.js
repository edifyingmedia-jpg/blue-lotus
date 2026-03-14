export class TransformManager {
  constructor(eventBus, nodeTree, selectionManager) {
    this.eventBus = eventBus;
    this.nodeTree = nodeTree;
    this.selectionManager = selectionManager;

    this.activeTransform = null;
    this.startX = 0;
    this.startY = 0;
  }

  beginTransform(nodeId, pointerX, pointerY) {
    const node = this.nodeTree.findNodeById(nodeId);
    if (!node) return;

    this.activeTransform = {
      nodeId,
      startX: node.x,
      startY: node.y,
      pointerStartX: pointerX,
      pointerStartY: pointerY
    };

    this.eventBus.emit("transform:start", { nodeId });
  }

  updateTransform(pointerX, pointerY) {
    if (!this.activeTransform) return;

    const { nodeId, startX, startY, pointerStartX, pointerStartY } =
      this.activeTransform;

    const node = this.nodeTree.findNodeById(nodeId);
    if (!node) return;

    const dx = pointerX - pointerStartX;
    const dy = pointerY - pointerStartY;

    node.setPosition(startX + dx, startY + dy);

    this.eventBus.emit("transform:move", {
      nodeId,
      x: node.x,
      y: node.y
    });
  }

  endTransform() {
    if (!this.activeTransform) return;

    const { nodeId } = this.activeTransform;

    this.activeTransform = null;

    this.eventBus.emit("transform:end", { nodeId });
  }
}
