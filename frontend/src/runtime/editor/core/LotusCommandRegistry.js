// frontend/src/runtime/editor/core/LotusCommandRegistry.js

/**
 * LotusCommandRegistry
 *
 * A unified registry of all commands that Blue Lotus supports.
 * This powers:
 * - LotusCommandPanel
 * - future command palettes
 * - slash commands
 * - keyboard shortcuts
 * - app-builder command surfaces
 */

export const LotusCommandRegistry = [
  /* ------------------------------
     Selection-Level Commands
  ------------------------------ */
  {
    name: "rewriteSelection",
    label: "Rewrite Selection",
    category: "selection",
    description: "Rewrites the selected text with improved clarity and flow.",
    payload: {},
  },
  {
    name: "fixTone",
    label: "Fix Tone",
    category: "selection",
    description: "Adjusts the tone of the selected text.",
    payload: { mode: "softer" },
  },
  {
    name: "applyStyle",
    label: "Apply Style",
    category: "selection",
    description: "Applies a narrative style to the selected text.",
    payload: { style: "cinematic" },
  },

  /* ------------------------------
     Paragraph-Level Commands
  ------------------------------ */
  {
    name: "summarizeSection",
    label: "Summarize Paragraph",
    category: "paragraph",
    description: "Summarizes the current paragraph.",
    payload: {},
  },

  /* ------------------------------
     Scene-Level Commands
  ------------------------------ */
  {
    name: "expandScene",
    label: "Expand Scene",
    category: "scene",
    description: "Expands the current scene with richer detail.",
    payload: { factor: 1.6 },
  },
  {
    name: "generateNextBeat",
    label: "Generate Next Beat",
    category: "scene",
    description: "Generates the next narrative beat based on the scene.",
    payload: {},
  },

  /* ------------------------------
     Structural Commands
  ------------------------------ */
  {
    name: "summarizeChapter",
    label: "Summarize Chapter",
    category: "chapter",
    description: "Summarizes the current chapter.",
    payload: {},
  },
  {
    name: "summarizeSectionStruct",
    label: "Summarize Section",
    category: "section",
    description: "Summarizes the current section.",
    payload: {},
  },
  {
    name: "rewriteBeat",
    label: "Rewrite Beat",
    category: "beat",
    description: "Rewrites the current story beat.",
    payload: {},
  },

  /* ------------------------------
     Future Commands (App Builder)
  ------------------------------ */
  {
    name: "createComponent",
    label: "Create Component",
    category: "builder",
    description: "Creates a new UI component (future app-builder feature).",
    payload: { type: "component" },
  },
  {
    name: "createScreen",
    label: "Create Screen",
    category: "builder",
    description: "Creates a new screen (future app-builder feature).",
    payload: { type: "screen" },
  },
];
