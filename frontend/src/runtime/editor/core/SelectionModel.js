// frontend/src/runtime/editor/core/SelectionModel.js

let selection = {
  start: 0,
  end: 0,
  text: "",
};

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

export function getSelection() {
  return selection;
}
