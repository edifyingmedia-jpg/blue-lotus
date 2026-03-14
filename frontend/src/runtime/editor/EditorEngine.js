import { EventBus } from "./engine/EventBus.js";
import { ToolRegistry } from "./engine/ToolRegistry.js";
import { PanelRegistry } from "./engine/PanelRegistry.js";
import { UndoManager } from "./engine/UndoManager.js";
import { CommandManager } from "./engine/CommandManager.js";

import { Canvas } from "./canvas/Canvas.js";
import { NodeTree } from "./canvas/NodeTree.js";
import { SelectionManager } from "./canvas/SelectionManager.js";
import { TransformManager } from "./canvas/TransformManager.js";
import { HitTest } from "./canvas/HitTest.js";

class EditorEngine {
  constructor() {
    // Core systems
    this.eventBus = new EventBus();
    this.undoManager = new UndoManager();
    this.commandManager = new CommandManager(this.undoManager);

    // Registries
    this.toolRegistry = new ToolRegistry(this.eventBus);
    this.panelRegistry = new PanelRegistry(this.eventBus);

    // Canvas systems
    this.nodeTree = new NodeTree();
    this.selectionManager = new SelectionManager(this.eventBus, this.nodeTree);
    this.transformManager = new TransformManager(
      this.eventBus,
      this.nodeTree,
      this.selectionManager
    );
    this.hitTest = new HitTest(this.nodeTree);

    this.canvas = null;

    // Editor state
    this.mode = "design"; // design | preview | inspect
  }

  mountCanvas(domElement) {
    this.canvas = new Canvas(
      this.eventBus,
      this.toolRegistry,
      this.nodeTree
    );

    this.canvas.mount(domElement);

    this._bindPointerEvents(domElement);
  }

  _bindPointerEvents(domElement) {
    domElement.addEventListener("pointerdown", (e) => {
      const node = this.hitTest.findNodeAt(e.offsetX, e.offsetY);

      if (node) {
        this.selectionManager.selectNode(node.id);
        this.transformManager.beginTransform(node.id, e.offsetX, e.offsetY);
      }
    });

    domElement.addEventListener("pointermove", (e) => {
      this.transformManager.updateTransform(e.offsetX, e.offsetY);
    });

    domElement.addEventListener("pointerup", () => {
      this.transformManager.endTransform();
    });
  }

  // Mode switching
  setMode(mode) {
    this.mode = mode;
    this.eventBus.emit("mode:changed", { mode });
  }

  // Project loading
  loadProject(projectData) {
    if (projectData?.tree) {
      this.nodeTree = NodeTree.deserialize(projectData.tree);
    }
    this.eventBus.emit("project:loaded", projectData);
  }
}

export default EditorEngine;
