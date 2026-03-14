import { Node } from "./Node.js";

export class NodeTree {
  constructor() {
    this.root = new Node({
      id: "root",
      type: "root",
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      children: []
    });
  }

  addNode(parentId, nodeData) {
    const parent = this.findNodeById(parentId);
    if (!parent) {
      console.warn(`Parent node not found: ${parentId}`);
      return null;
    }

    const newNode = new Node(nodeData);
    parent.addChild(newNode);
    return newNode;
  }

  removeNode(nodeId) {
    if (nodeId === "root") return;

    const parent = this.findParentOf(nodeId);
    if (!parent) return;

    parent.removeChild(nodeId);
  }

  findNodeById(id, current = this.root) {
    if (current.id === id) return current;

    for (const child of current.children) {
      const found = this.findNodeById(id, child);
      if (found) return found;
    }

    return null;
  }

  findParentOf(id, current = this.root) {
    for (const child of current.children) {
      if (child.id === id) return current;

      const found = this.findParentOf(id, child);
      if (found) return found;
    }

    return null;
  }

  getAllNodes(current = this.root, list = []) {
    list.push(current);

    for (const child of current.children) {
      this.getAllNodes(child, list);
    }

    return list;
  }

  serialize() {
    return this.root.serialize();
  }

  static deserialize(data) {
    const tree = new NodeTree();
    tree.root = Node.deserialize(data);
    return tree;
  }
}
