/**
 * ActionDispatcher.js
 * ----------------------------------------------------
 * Executes individual action definitions.
 *
 * Responsibilities:
 *  - Interpret action objects
 *  - Call the correct runtime engine method
 *  - Never mutate state directly
 */

export default class ActionDispatcher {
  constructor({ stateEngine, navigationEngine }) {
    if (!stateEngine) {
      throw new Error("ActionDispatcher requires stateEngine");
    }
    if (!navigationEngine) {
      throw new Error("ActionDispatcher requires navigationEngine");
    }

    this.stateEngine = stateEngine;
    this.navigationEngine = navigationEngine;
  }

  /**
   * Execute a single action definition.
   */
  dispatch(action) {
    if (!action || typeof action !== "object") {
      throw new Error("ActionDispatcher.dispatch requires an action object");
    }

    switch (action.type) {
      case "setState":
        return this.handleSetState(action);

      case "navigate":
        return this.handleNavigate(action);

      case "conditional":
        return this.handleConditional(action);

      default:
        throw new Error(`Unknown action type: '${action.type}'`);
    }
  }

  /**
   * setState action
   */
  handleSetState(action) {
    const { path, value } = action;

    if (!path || typeof path !== "string") {
      throw new Error("setState action requires a string path");
    }

    this.stateEngine.set(path, value);
  }

  /**
   * navigate action
   */
  handleNavigate(action) {
    const { screenId, params } = action;

    if (!screenId || typeof screenId !== "string") {
      throw new Error("navigate action requires a screenId string");
    }

    return this.navigationEngine.navigate(screenId, params || {});
  }

  /**
   * conditional action
   */
  handleConditional(action) {
    const { if: condition, then: thenAction, else: elseAction } = action;

    if (!condition || typeof condition !== "object") {
      throw new Error("conditional action requires an 'if' block");
    }

    const left = this.stateEngine.get(condition.left);
    const right = condition.right;

    const result = this.evaluateCondition(left, condition.op, right);

    if (result && thenAction) {
      return this.dispatch(thenAction);
    }

    if (!result && elseAction) {
      return this.dispatch(elseAction);
    }
  }

  /**
   * Evaluate a simple comparison operator.
   */
  evaluateCondition(left, op, right) {
    switch (op) {
      case "==": return left == right;
      case "===": return left === right;
      case "!=": return left != right;
      case "!==": return left !== right;
      case ">": return left > right;
      case "<": return left < right;
      case ">=": return left >= right;
      case "<=": return left <= right;
      default:
        throw new Error(`Unknown conditional operator: '${op}'`);
    }
  }
}
