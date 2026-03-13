// NavigationEngine.js
// Clean, modern, stack-based navigation engine for Blue Lotus Runtime

export default class NavigationEngine {
  constructor(initialScreen = "Login") {
    this.stack = [initialScreen];
    this.listeners = new Set();
  }

  // --- Core Stack Operations ---

  get current() {
    return this.stack[this.stack.length - 1];
  }

  push(screenId) {
    if (!screenId) return;
    this.stack.push(screenId);
    this._emit();
  }

  replace(screenId) {
    if (!screenId) return;
    this.stack[this.stack.length - 1] = screenId;
    this._emit();
  }

  pop() {
    if (this.stack.length > 1) {
      this.stack.pop();
      this._emit();
    }
  }

  reset(screenId = "Login") {
    this.stack = [screenId];
    this._emit();
  }

  // --- Auth Integration ---

  handleLogout() {
    // Clear stack and return to Login
    this.reset("Login");
  }

  // --- Listener System ---

  onChange(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  _emit() {
    for (const cb of this.listeners) {
      cb(this.current, [...this.stack]);
    }
  }
}
