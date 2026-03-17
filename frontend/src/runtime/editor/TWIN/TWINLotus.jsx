// frontend/src/runtime/editor/TWIN/TWINLotus.jsx

import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";

import EventBus from "../core/EventBus";
import { getSelection } from "../core/SelectionModel";
import {
  getCurrentParagraph,
  getSurroundingParagraphs,
  getCurrentScene,
} from "../core/ContextModel";

import {
  getChapters,
  getCurrentChapter,
  getSections,
  getCurrentSection,
  getBeats,
  getCurrentBeat,
} from "../core/StructuralContextModel";

import { applyContextualReplacement } from "../core/TextRegionEngine";

const TWIN_STATES = {
  IDLE: "IDLE",
  LISTENING: "LISTENING",
  PROCESSING: "PROCESSING",
  UPDATING: "UPDATING",
  ERROR: "ERROR",
};

const EDITOR_EVENT_CHANNEL = "editor:event";
const EDITOR_UPDATE_CHANNEL = "editor:update";

/* ------------------------------
   Utility Functions
------------------------------ */

function normalizeText(text) {
  if (typeof text !== "string") return "";
  return text.replace(/\r\n/g, "\n");
}

function summarize(text, maxSentences = 3) {
  const clean = normalizeText(text);
  const sentences = clean.split(/(?<=[.!?])\s+/).filter(Boolean);
  return sentences.slice(0, maxSentences).join(" ");
}

function expand(text, factor = 1.5) {
  const clean = normalizeText(text);
  if (!clean.trim()) return clean;

  const words = clean.split(/\s+/);
  const targetLength = Math.ceil(words.length * factor);

  const filler = [
    "with greater clarity",
    "in more vivid detail",
    "exploring the emotional undercurrent",
    "revealing subtle motivations",
    "deepening the atmosphere",
  ];

  const result = [...words];
  let i = 0;

  while (result.length < targetLength) {
    result.push(filler[i % filler.length]);
    i += 1;
  }

  return result.join(" ");
}

function adjustTone(text, mode = "softer") {
  const clean = normalizeText(text);

  if (mode === "softer") {
    return clean
      .replace(/\b(hate|furious|rage|disgust)\b/gi, "dislike")
      .replace(/\b(never|impossible)\b/gi, "rarely");
  }

  if (mode === "stronger") {
    return clean
      .replace(/\b(like|upset|sad)\b/gi, "deeply affected")
      .replace(/\b(maybe|perhaps)\b/gi, "absolutely");
  }

  return clean;
}

function applyStyle(text, style = "cinematic") {
  const clean = normalizeText(text);

  if (style === "cinematic") {
    return `The scene unfolds:\n\n${clean}`;
  }

  if (style === "intimate") {
    return `Close to the character's thoughts:\n\n${clean}`;
  }

  if (style === "omniscient") {
    return `From above it all, the narrator sees:\n\n${clean}`;
  }

  return clean;
}

function generateNextBeat(contextText) {
  const clean = normalizeText(contextText);
  const lastLine = clean.split("\n").filter(Boolean).slice(-1)[0] || "";

  return `${clean}\n\nNext beat:\n${
    lastLine
      ? `Something shifts after: "${lastLine}"`
      : "A new tension emerges in the scene."
  }`;
}

/* ------------------------------
   Lotus Command Registry
------------------------------ */

const lotusCommands = {
  rewriteSelection(payload, currentText) {
    const base = payload.selection?.text || currentText;
    const trimmed = base.trim();
    const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);

    return {
      text: capitalized,
      meta: { command: "rewriteSelection" },
    };
  },

  summarizeSection(payload, currentText) {
    const base =
      payload.selection?.text ||
      payload.paragraph?.text ||
      payload.section?.content ||
      currentText;

    return {
      text: summarize(base),
      meta: { command: "summarizeSection" },
    };
  },

  expandScene(payload, currentText) {
    const base = payload.scene?.text || currentText;

    return {
      text: expand(base, payload.factor || 1.6),
      meta: { command: "expandScene" },
    };
  },

  fixTone(payload, currentText) {
    const base = payload.selection?.text || currentText;

    return {
      text: adjustTone(base, payload.mode || "softer"),
      meta: { command: "fixTone" },
    };
  },

  applyStyle(payload, currentText) {
    const base = payload.selection?.text || currentText;

    return {
      text: applyStyle(base, payload.style || "cinematic"),
      meta: { command: "applyStyle" },
    };
  },

  generateNextBeat(payload, currentText) {
    const base =
      payload.beat ||
      payload.scene?.text ||
      payload.paragraph?.text ||
      currentText;

    return {
      text: generateNextBeat(base),
      meta: { command: "generateNextBeat" },
    };
  },
};

function runLotusCommand(name, payload, currentText) {
  const fn = lotusCommands[name];
  if (!fn) throw new Error(`Unknown Lotus command: ${name}`);
  return fn(payload, currentText);
}

/* ------------------------------
   TWINLotus Component
------------------------------ */

const TWINLotus = ({ initialText, onChange }) => {
  const [state, setState] = useState(TWIN_STATES.IDLE);
  const [lastError, setLastError] = useState(null);
  const [currentText, setCurrentText] = useState(
    normalizeText(initialText || "")
  );

  const emitUpdate = useCallback(
    (update) => {
      const payload = {
        ...update,
        text: update.text ?? currentText,
        timestamp: Date.now(),
      };

      EventBus.emit(EDITOR_UPDATE_CHANNEL, payload);

      if (typeof onChange === "function" && payload.text !== currentText) {
        onChange(payload.text, payload);
      }
    },
    [currentText, onChange]
  );

  const handleEditorEvent = useCallback(
    (event) => {
      if (!event || typeof event !== "object") return;

      setState(TWIN_STATES.LISTENING);
      setLastError(null);

      const { action, payload } = event;

      if (action === "update_text") {
        const next = normalizeText(payload?.value || "");
        setCurrentText(next);

        setState(TWIN_STATES.UPDATING);
        emitUpdate({ text: next, source: "editor" });
        setState(TWIN_STATES.IDLE);
        return;
      }

      if (action === "lotus_command") {
        setState(TWIN_STATES.PROCESSING);

        try {
          const selection = getSelection();
          const paragraph = getCurrentParagraph();
          const surrounding = getSurroundingParagraphs();
          const scene = getCurrentScene();

          const chapter = getCurrentChapter();
          const section = getCurrentSection();
          const beat = getCurrentBeat();

          const enrichedPayload = {
            ...payload,
            selection,
            paragraph,
            surrounding,
            scene,
            chapter,
            section,
            beat,
            chapters: getChapters(),
            sections: getSections(),
            beats: getBeats(),
          };

          const result = runLotusCommand(
            payload.command,
            enrichedPayload,
            currentText
          );

          const merged = applyContextualReplacement(
            enrichedPayload,
            result.text
          );

          const nextText = normalizeText(merged);
          setCurrentText(nextText);

          setState(TWIN_STATES.UPDATING);
          emitUpdate({
            text: nextText,
            source: "lotus",
            meta: result.meta || {},
          });

          setState(TWIN_STATES.IDLE);
        } catch (err) {
          console.error("[TWINLotus] Command error:", err);
          setLastError(err.message || "Unknown error");
          setState(TWIN_STATES.ERROR);

          emitUpdate({
            text: currentText,
            source: "lotus",
            error: err.message || "Unknown error",
          });

          setState(TWIN_STATES.IDLE);
        }

        return;
      }
    },
    [currentText, emitUpdate]
  );

  useEffect(() => {
    EventBus.on(EDITOR_EVENT_CHANNEL, handleEditorEvent);
    return () =>
      EventBus.off(EDITOR_EVENT_CHANNEL, handleEditorEvent);
  }, [handleEditorEvent]);

  return (
    <div
      data-twin-lotus
      data-state={state}
      style={{ display: "none" }}
    >
      {lastError && (
        <span
          data-twin-lotus-error={lastError}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

TWINLotus.propTypes = {
  initialText: PropTypes.string,
  onChange: PropTypes.func,
};

TWINLotus.defaultProps = {
  initialText: "",
  onChange: undefined,
};

export default TWINLotus;
