export class CommandManager {
  constructor(eventBus, undoManager) {
    this.eventBus = eventBus;
    this.undoManager = undoManager;
    this.commands = new Map();
  }

  registerCommand(name, execute, undo) {
    this.commands.set(name, { execute, undo });
  }

  run(name, payload = {}) {
    const command = this.commands.get(name);
    if (!command) {
      console.warn(`Command not found: ${name}`);
      return;
    }

    const result = command.execute(payload);

    // Record undo step if available
    if (command.undo) {
      this.undoManager.record({
        undo: () => command.undo(payload),
        redo: () => command.execute(payload)
      });
    }

    this.eventBus.emit("command:executed", { name, payload });
    return result;
  }
}
