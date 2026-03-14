// frontend/src/runtime/editor/TWIN/TWINActionLibrary.js

/**
 * TWINActionLibrary.js
 * -------------------------------------------
 * Centralized library of executable editor actions.
 *
 * This module defines WHAT the editor can do:
 * - align elements
 * - delete selection
 * - edit selection
 * - create elements
 * - navigate
 *
 * It does NOT:
 * - interpret meaning (Interpreter)
 * - decide actions (ActionRouter)
 * - enforce safety (TWINSafety)
 * - speak or animate (TWINmanager)
 *
 * It ONLY executes editor-level operations.
 */

const TWINActionLibrary = (() => {

  // ---------------------------------------------------------
  // 1. Align Elements
  // ---------------------------------------------------------
  function alignElements({ canvas, mode = "auto" }) {
    if (!canvas) return;

    const selected = canvas.getSelectedElements();
    if (!selected || selected.length === 0) return;

    switch (mode) {
      case "center":
        canvas.alignCenter(selected);
        break;

      case "distribute":
        canvas.distributeEvenly(selected);
        break;

      default:
        canvas.autoAlign(selected);
        break;
    }
  }

  // ---------------------------------------------------------
  // 2. Delete Selection
  // ---------------------------------------------------------
  function deleteSelection({ canvas }) {
    if (!canvas) return;
    const selected = canvas.getSelectedElements();
    if (selected && selected.length > 0) {
      canvas.deleteElements(selected);
    }
  }

  // ---------------------------------------------------------
  // 3. Edit Selection
  // ---------------------------------------------------------
  function editSelection({ canvas, params = {} }) {
    if (!canvas) return;

    const selected = canvas.getSelectedElements();
    if (!selected || selected.length === 0) return;

    selected.forEach(el => {
      if (params.color) el.setColor(params.color);
      if (params.size === "increase") el.scale(1.1);
      if (params.size === "decrease") el.scale(0.9);
    });
  }

  // ---------------------------------------------------------
  // 4. Create Element
  // ---------------------------------------------------------
  function createElement({ canvas, type = "auto" }) {
    if (!canvas) return;

    let elementType = type;

    if (type === "auto") {
      elementType = "box"; // default placeholder
    }

    const newElement = canvas.createElement(elementType);
    canvas.addElement(newElement);
    canvas.selectElement(newElement);
  }

  // ---------------------------------------------------------
  // 5. Navigation (placeholder for future routing)
  // ---------------------------------------------------------
  function navigate({ target }) {
    console.log("Navigation requested:", target);
    // Future: integrate with Blue Lotus internal navigation
  }

  // ---------------------------------------------------------
  // 6. Action Executor
  // ---------------------------------------------------------
  function execute(action, context = {}) {
    if (!action || !action.type) return;

    switch (action.type) {
      case "alignElements":
        return alignElements(context);

      case "deleteSelection":
        return deleteSelection(context);

      case "editSelection":
        return editSelection(context);

      case "createElement":
        return createElement(context);

      case "navigate":
        return navigate(context);

      default:
        console.warn("Unknown action:", action.type);
        return;
    }
  }

  // ---------------------------------------------------------
  // 7. Exports
  // ---------------------------------------------------------
  return {
    execute,
    alignElements,
    deleteSelection,
    editSelection,
    createElement,
    navigate
  };

})();

export default TWINActionLibrary;
