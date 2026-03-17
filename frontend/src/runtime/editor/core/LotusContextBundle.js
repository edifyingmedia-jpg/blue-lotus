// frontend/src/runtime/editor/core/LotusContextBundle.js

/**
 * LotusContextBundle
 *
 * Provides a single unified function that gathers:
 * - selection
 * - paragraph
 * - surrounding paragraphs
 * - scene
 * - chapter
 * - section
 * - beat
 * - all chapters
 * - all sections
 * - all beats
 *
 * This keeps TWINLotus clean and prevents import clutter.
 */

import { getSelection } from "./SelectionModel";
import {
  getCurrentParagraph,
  getSurroundingParagraphs,
  getCurrentScene,
} from "./ContextModel";

import {
  getChapters,
  getCurrentChapter,
  getSections,
  getCurrentSection,
  getBeats,
  getCurrentBeat,
} from "./StructuralContextModel";

export function getLotusContext() {
  return {
    // Fine-grained context
    selection: getSelection(),
    paragraph: getCurrentParagraph(),
    surrounding: getSurroundingParagraphs(),
    scene: getCurrentScene(),

    // Structural context
    chapter: getCurrentChapter(),
    section: getCurrentSection(),
    beat: getCurrentBeat(),

    // Collections
    chapters: getChapters(),
    sections: getSections(),
    beats: getBeats(),
  };
}
