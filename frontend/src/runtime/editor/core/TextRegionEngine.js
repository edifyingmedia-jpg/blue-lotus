// frontend/src/runtime/editor/core/TextRegionEngine.js

/**
 * TextRegionEngine
 *
 * Safely replaces:
 * - selected text
 * - current paragraph
 * - current scene
 *
 * without breaking the rest of the document.
 */

import { getText, setText } from "./DocumentModel";
import { getSelection } from "./SelectionModel";
import { getCurrentParagraph, getCurrentScene } from "./ContextModel";

/* -------------------------------------------------------
   Replace only the selected region
------------------------------------------------------- */
export function replaceSelection(newText) {
  const full = getText();
  const { start, end } = getSelection();

  const before = full.slice(0, start);
  const after = full.slice(end);

  const merged = before + newText + after;

  setText(merged);
  return merged;
}

/* -------------------------------------------------------
   Replace the entire current paragraph
------------------------------------------------------- */
export function replaceParagraph(newText) {
  const full = getText();
  const paragraph = getCurrentParagraph();

  // Split into paragraphs
  const parts = full.split(/\n{2,}/);

  // Replace the correct one
  parts[paragraph.index] = newText.trim();

  const merged = parts.join("\n\n");
  setText(merged);
  return merged;
}

/* -------------------------------------------------------
   Replace the entire current scene
------------------------------------------------------- */
export function replaceScene(newText) {
  const full = getText();
  const scene = getCurrentScene();

  // Split scenes by ### or ---
  const parts = full.split(/(?:^|\n)(?:###|---)\s*/g);

  // Replace the correct scene
  parts[scene.index] = newText.trim();

  // Reconstruct with scene markers preserved
  const merged = parts
    .map((p, i) => (i === 0 ? p : `\n\n### ${p}`))
    .join("");

  setText(merged);
  return merged;
}

/* -------------------------------------------------------
   Smart replacement router
------------------------------------------------------- */
export function applyContextualReplacement(payload, newText) {
  // If user selected text → replace selection
  if (payload.selection && payload.selection.text) {
    return replaceSelection(newText);
  }

  // If command is paragraph-based
  if (payload.paragraph && payload.paragraph.text) {
    return replaceParagraph(newText);
  }

  // If command is scene-based
  if (payload.scene && payload.scene.text) {
    return replaceScene(newText);
  }

  // Fallback: replace entire document
  setText(newText);
  return newText;
}
