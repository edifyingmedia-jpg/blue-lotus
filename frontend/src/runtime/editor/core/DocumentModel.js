// frontend/src/runtime/editor/core/DocumentModel.js

let currentText = "";

export function getText() {
  return currentText;
}

export function setText(nextText) {
  currentText = typeof nextText === "string" ? nextText : "";
  return currentText;
}

/**
 * Apply an update payload coming from TWINLotus.
 * Expects shape like:
 * {
 *   text: string,
 *   source: "editor" | "lotus",
 *   meta?: object,
 *   error?: string
 * }
 */
export function applyUpdate(update) {
  if (!update || typeof update !== "object") return currentText;
  if (typeof update.text === "string") {
    currentText = update.text;
  }
  return currentText;
}
