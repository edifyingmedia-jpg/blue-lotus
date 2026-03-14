export class HitTest {
  constructor(nodeTree) {
    this.nodeTree = nodeTree;
  }

  /**
   * Returns the topmost node under the pointer.
   * Hit‑testing is done back‑to‑front so deeper nodes appear above parents.
   */
  findNodeAt(x, y) {
    const allNodes = this.nodeTree.getAllNodes();

    // Reverse so children (drawn later) are checked first
    for (let i = allNodes.length - 1; i >= 0; i--) {
      const node = allNodes[i];

      if (this._pointInsideNode(x, y, node)) {
        return node;
      }
    }

    return null;
  }

  _pointInsideNode(x, y, node) {
    return (
      x >= node.x &&
      y >= node.y &&
      x <= node.x + node.width &&
      y <= node.y + node.height
    );
  }
}
