// NavigationEngine.js (Upgraded Standard Version)

class NavigationEngine {
  constructor(initialScreen) {
    this.stack = [initialScreen];       // main navigation stack
    this.modal = null;                  // holds modal screen id if open
    this.listeners = new Set();         // subscribers for navigation changes
  }

  // --- Core Stack Navigation ---

  push(screenId) {
    this.stack.push(screenId);
    this._notify();
  }

  replace(screenId) {
    this.stack[this.stack.length - 1] = screenId;
    this._notify();
  }

  pop() {
    if (this.stack.length > 1) {
      this.stack.pop();
      this._notify();
    }
  }

  reset(screenId) {
    this.stack = [screenId];
    this._notify();
  }

  // --- Modal Navigation ---

  openModal(screenId) {
    this.modal = screenId;
    this._notify();
  }

  closeModal() {
    this.modal = null;
    this._notify();
  }

  // --- Getters ---

  getCurrentScreen() {
    return this.modal || this.stack[this.stack.length - 1];
  }

  getModalScreen() {
    return this.modal;
  }

  getStack() {
    return [...this.stack];
  }

  // --- Listener System ---

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  _notify() {
    for (const callback of this.listeners) {
      callback(this.getCurrentScreen(), this.getStack(), this.modal);
    }
  }
}

export default NavigationEngine;
