// frontend/src/runtime/editor/core/ContextModel.js

/**
 * ContextModel analyzes the document text and provides:
 * - current paragraph
 * - surrounding paragraphs
 * - scene boundaries
 * - scene context
 *
 * This gives TWINLotus the ability to perform context-aware
 * transformations instead of operating blindly.
 */

import { getText } from "./DocumentModel";
import { getSelection } from "./SelectionModel";

/**
 * Split text into paragraphs.
 */
export function getParagraphs() {
  const text = getText();
  return text
    .split(/\n{2,}/) // two or more newlines = paragraph break
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * Determine which paragraph the selection is inside.
 */
export function getCurrentParagraph() {
  const text = getText();
  const { start } = getSelection();

  const paragraphs = text.split(/\n{2,}/);
  let index = 0;
  let runningLength = 0;

  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    const pLength = p.length + 2; // account for the paragraph break

    if (start >= runningLength && start <= runningLength + pLength) {
      index = i;
      break;
    }

    runningLength += pLength;
  }

  return {
    index,
    text: paragraphs[index]?.trim() || "",
  };
}

/**
 * Get the paragraph before and after the current one.
 */
export function getSurroundingParagraphs() {
  const paragraphs = getParagraphs();
  const { index } = getCurrentParagraph();

  return {
    previous: paragraphs[index - 1] || "",
    current: paragraphs[index] || "",
    next: paragraphs[index + 1] || "",
  };
}

/**
 * Scenes are separated by lines starting with ### or ---
 * This is a common writing convention.
 */
export function getScenes() {
  const text = getText();

  return text
    .split(/(?:^|\n)(?:###|---)\s*/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Determine which scene the selection is inside.
 */
export function getCurrentScene() {
  const text = getText();
  const { start } = getSelection();

  const sceneRegex = /(?:^|\n)(?:###|---)\s*/g;
  let match;
  const boundaries = [];

  while ((match = sceneRegex.exec(text)) !== null) {
    boundaries.push(match.index);
  }

  boundaries.push(text.length);

  let sceneIndex = 0;

  for (let i = 0; i < boundaries.length - 1; i++) {
    const sceneStart = boundaries[i];
    const sceneEnd = boundaries[i + 1];

    if (start >= sceneStart && start < sceneEnd) {
      sceneIndex = i;
      break;
    }
  }

  const scenes = getScenes();

  return {
    index: sceneIndex,
    text: scenes[sceneIndex] || "",
  };
}
