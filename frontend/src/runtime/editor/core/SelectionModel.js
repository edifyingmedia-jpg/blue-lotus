// frontend/src/runtime/editor/core/SelectionModel.js

/**
 * Tracks the user's current text selection inside the editor.
 * This is used by TWINLotus to perform precise, context-aware
 * transformations on the selected region.
 */

let selection = {
  start: 0,
  end: 0,
  text: "",
};

/**
 * Update the selection model based on the textarea's state.
 * Ensures indices are always valid and safe.
 */
export function updateSelection(start, end, fullText) {
  const safeStart = Math.max(0, Math.min(start, fullText.length));
  const safeEnd = Math.max(0, Math.min(end, fullText.length));

  selection = {
    start: safeStart,
    end: safeEnd,
    text: fullText.slice(safeStart, safeEnd),
  };

  return selection;
}

/**
 * Retrieve the current selection snapshot.
 */
export function getSelection() {
  return selection;
}
