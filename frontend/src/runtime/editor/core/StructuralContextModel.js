// frontend/src/runtime/editor/core/StructuralContextModel.js

/**
 * StructuralContextModel
 *
 * Provides high-level structural awareness:
 * - chapters (#)
 * - sections (##)
 * - subsections (###)
 * - scene breaks (--- or ***)
 * - story beats (- Beat:, - Note:, etc.)
 *
 * This allows TWINLotus to perform structural editing
 * and understand the document as a hierarchy.
 */

import { getText } from "./DocumentModel";
import { getSelection } from "./SelectionModel";

/* -------------------------------------------------------
   Chapter Detection (# Heading)
------------------------------------------------------- */
export function getChapters() {
  const text = getText();

  const lines = text.split("\n");
  const chapters = [];
  let current = { title: "", content: "" };

  lines.forEach((line) => {
    if (line.startsWith("# ")) {
      if (current.title || current.content) {
        chapters.push({ ...current });
      }
      current = { title: line.replace("# ", "").trim(), content: "" };
    } else {
      current.content += line + "\n";
    }
  });

  if (current.title || current.content.trim()) {
    chapters.push(current);
  }

  return chapters;
}

export function getCurrentChapter() {
  const text = getText();
  const { start } = getSelection();

  const lines = text.split("\n");
  let index = 0;
  let runningLength = 0;

  const chapters = getChapters();

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("# ")) {
      const chapterStart = runningLength;
      const chapterEnd =
        i + 1 < lines.length
          ? text.indexOf("# ", runningLength + lines[i].length + 1)
          : text.length;

      if (start >= chapterStart && start < chapterEnd) {
        return {
          index,
          title: chapters[index].title,
          content: chapters[index].content.trim(),
        };
      }

      index++;
    }

    runningLength += lines[i].length + 1;
  }

  return {
    index: 0,
    title: chapters[0]?.title || "",
    content: chapters[0]?.content || "",
  };
}

/* -------------------------------------------------------
   Section Detection (## Heading)
------------------------------------------------------- */
export function getSections() {
  const text = getText();
  const lines = text.split("\n");

  const sections = [];
  let current = { title: "", content: "" };

  lines.forEach((line) => {
    if (line.startsWith("## ")) {
      if (current.title || current.content) {
        sections.push({ ...current });
      }
      current = { title: line.replace("## ", "").trim(), content: "" };
    } else {
      current.content += line + "\n";
    }
  });

  if (current.title || current.content.trim()) {
    sections.push(current);
  }

  return sections;
}

export function getCurrentSection() {
  const text = getText();
  const { start } = getSelection();

  const lines = text.split("\n");
  let index = 0;
  let runningLength = 0;

  const sections = getSections();

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("## ")) {
      const sectionStart = runningLength;
      const sectionEnd =
        i + 1 < lines.length
          ? text.indexOf("## ", runningLength + lines[i].length + 1)
          : text.length;

      if (start >= sectionStart && start < sectionEnd) {
        return {
          index,
          title: sections[index].title,
          content: sections[index].content.trim(),
        };
      }

      index++;
    }

    runningLength += lines[i].length + 1;
  }

  return {
    index: 0,
    title: sections[0]?.title || "",
    content: sections[0]?.content || "",
  };
}

/* -------------------------------------------------------
   Beat Detection (- Beat:, - Note:, etc.)
------------------------------------------------------- */
export function getBeats() {
  const text = getText();
  const lines = text.split("\n");

  return lines
    .filter((line) => line.trim().match(/^-\s*(Beat|Note|Idea|Moment):/i))
    .map((line) => line.trim());
}

export function getCurrentBeat() {
  const text = getText();
  const { start } = getSelection();

  const lines = text.split("\n");
  let runningLength = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineStart = runningLength;
    const lineEnd = runningLength + line.length;

    if (
      start >= lineStart &&
      start <= lineEnd &&
      line.trim().match(/^-\s*(Beat|Note|Idea|Moment):/i)
    ) {
      return line.trim();
    }

    runningLength += line.length + 1;
  }

  return "";
}
