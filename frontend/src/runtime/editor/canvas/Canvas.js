export class Canvas {
  constructor(eventBus, toolRegistry, nodeTree) {
    this.eventBus = eventBus;
    this.toolRegistry = toolRegistry;
    this.nodeTree = nodeTree;

    this.canvasElement = null;
    this.ctx = null;

    this.isPointerDown = false;
  }

  mount(domElement) {
    this.canvasElement = domElement;
    this.ctx = domElement.getContext("2d");

    this._bindEvents();
    this.render();
  }

  _bindEvents() {
    this.canvasElement.addEventListener("pointerdown", (e) => {
      this.isPointerDown = true;
      this.toolRegistry.handlePointerEvent({
        type: "pointerdown",
        x: e.offsetX,
        y: e.offsetY
      });
    });

    this.canvasElement.addEventListener("pointermove", (e) => {
      if (!this.isPointerDown) return;

      this.toolRegistry.handlePointerEvent({
        type: "pointermove",
        x: e.offsetX,
        y: e.offsetY
      });
    });

    this.canvasElement.addEventListener("pointerup", (e) => {
      this.isPointerDown = false;

      this.toolRegistry.handlePointerEvent({
        type: "pointerup",
        x: e.offsetX,
        y: e.offsetY
      });
    });
  }

  render() {
    if (!this.ctx) return;

    // Clear canvas
    this.ctx.clearRect(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );

    // Draw nodes (placeholder)
    const nodes = this.nodeTree.getAllNodes();
    nodes.forEach((node) => {
      this._drawNode(node);
    });

    requestAnimationFrame(() => this.render());
  }

  _drawNode(node) {
    const { x, y, width, height } = node;

    this.ctx.fillStyle = "#444";
    this.ctx.fillRect(x, y, width, height);
  }
}
