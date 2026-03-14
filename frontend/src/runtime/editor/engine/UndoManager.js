// UndoManager.js
// A tiny, self-contained history manager for the EditorEngine

export default class UndoManager {
  constructor() {
    this.history = [];
    this.redoStack = [];
    this.maxHistory = 50; // prevent infinite memory growth
  }

  // Save a snapshot of editor state
  push(state) {
    const snapshot = JSON.parse(JSON.stringify(state));
    this.history.push(snapshot);

    // Clear redo stack whenever new action occurs
    this.redoStack = [];

    // Limit history size
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  // Undo: move last state into redo stack
  undo(currentState) {
    if (this.history.length === 0) return currentState;

    const previous = this.history.pop();
    const snapshot = JSON.parse(JSON.stringify(currentState));
    this.redoStack.push(snapshot);

    return previous;
  }

  // Redo: move last redo state back into history
  redo(currentState) {
    if (this.redoStack.length === 0) return currentState;

    const next = this.redoStack.pop();
    const snapshot = JSON.parse(JSON.stringify(currentState));
    this.history.push(snapshot);

    return next;
  }
}
