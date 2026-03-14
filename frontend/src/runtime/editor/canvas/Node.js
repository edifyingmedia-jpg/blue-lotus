export class Node {
  constructor({
    id,
    type = "frame",
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    props = {},
    children = []
  }) {
    this.id = id || crypto.randomUUID();
    this.type = type;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.props = props;
    this.children = children;
    this.parent = null;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
  }

  addChild(node) {
    node.parent = this;
    this.children.push(node);
  }

  removeChild(nodeId) {
    this.children = this.children.filter((child) => child.id !== nodeId);
  }

  serialize() {
    return {
      id: this.id,
      type: this.type,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      props: this.props,
      children: this.children.map((child) => child.serialize())
    };
  }

  static deserialize(data) {
    const node = new Node(data);
    node.children = data.children.map((child) => Node.deserialize(child));
    return node;
  }
}
