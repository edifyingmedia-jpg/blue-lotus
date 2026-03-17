// frontend/src/runtime/editor/core/StructuralEditingEngine.js

/**
 * StructuralEditingEngine
 *
 * Provides editing operations for:
 * - chapters
 * - sections
 * - subsections
 * - beats
 *
 * Works alongside StructuralContextModel and TextRegionEngine.
 */

import { getText, setText } from "./DocumentModel";
import {
  getChapters,
  getCurrentChapter,
  getSections,
  getCurrentSection,
  getBeats,
  getCurrentBeat,
} from "./StructuralContextModel";

/* -------------------------------------------------------
   Replace a chapter by index
------------------------------------------------------- */
export function replaceChapter(index, newContent) {
  const chapters = getChapters();

  if (!chapters[index]) return getText();

  chapters[index].content = newContent.trim();

  const merged = chapters
    .map((c) => `# ${c.title}\n\n${c.content.trim()}`)
    .join("\n\n");

  setText(merged);
  return merged;
}

/* -------------------------------------------------------
   Replace the current chapter
------------------------------------------------------- */
export function replaceCurrentChapter(newContent) {
  const chapter = getCurrentChapter();
  return replaceChapter(chapter.index, newContent);
}

/* -------------------------------------------------------
   Replace a section by index
------------------------------------------------------- */
export function replaceSection(index, newContent) {
  const sections = getSections();

  if (!sections[index]) return getText();

  sections[index].content = newContent.trim();

  const merged = sections
    .map((s) => `## ${s.title}\n\n${s.content.trim()}`)
    .join("\n\n");

  setText(merged);
  return merged;
}

/* -------------------------------------------------------
   Replace the current section
------------------------------------------------------- */
export function replaceCurrentSection(newContent) {
  const section = getCurrentSection();
  return replaceSection(section.index, newContent);
}

/* -------------------------------------------------------
   Replace a beat by matching the exact line
------------------------------------------------------- */
export function replaceBeat(oldBeat, newBeat) {
  const full = getText();
  const lines = full.split("\n");

  const updated = lines.map((line) =>
    line.trim() === oldBeat.trim() ? newBeat.trim() : line
  );

  const merged = updated.join("\n");
  setText(merged);
  return merged;
}

/* -------------------------------------------------------
   Replace the current beat
------------------------------------------------------- */
export function replaceCurrentBeat(newBeat) {
  const beat = getCurrentBeat();
  if (!beat) return getText();
  return replaceBeat(beat, newBeat);
}

/* -------------------------------------------------------
   Smart structural replacement router
------------------------------------------------------- */
export function applyStructuralReplacement(payload, newText) {
  // Beat-level replacement
  if (payload.beat) {
    return replaceCurrentBeat(newText);
  }

  // Section-level replacement
  if (payload.section && payload.section.content) {
    return replaceCurrentSection(newText);
  }

  // Chapter-level replacement
  if (payload.chapter && payload.chapter.content) {
    return replaceCurrentChapter(newText);
  }

  // Fallback: return unchanged
  return getText();
}
