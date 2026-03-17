import React from "react";
import EventBus from "./core/EventBus";

const EDITOR_EVENT_CHANNEL = "editor:event";

function fire(command, payload = {}) {
  EventBus.emit(EDITOR_EVENT_CHANNEL, {
    action: "lotus_command",
    payload: { command, ...payload },
  });
}

const LotusCommandPanel = () => {
  return (
    <div
      data-lotus-command-panel
      style={{
        display: "flex",
        gap: "8px",
        padding: "8px 0",
        flexWrap: "wrap",
      }}
    >
      <button onClick={() => fire("rewriteSelection")}>
        Rewrite
      </button>

      <button onClick={() => fire("summarizeSection")}>
        Summarize
      </button>

      <button onClick={() => fire("expandScene", { factor: 1.6 })}>
        Expand
      </button>

      <button onClick={() => fire("fixTone", { mode: "softer" })}>
        Soften Tone
      </button>

      <button onClick={() => fire("fixTone", { mode: "stronger" })}>
        Strengthen Tone
      </button>

      <button onClick={() => fire("applyStyle", { style: "cinematic" })}>
        Cinematic
      </button>

      <button onClick={() => fire("applyStyle", { style: "intimate" })}>
        Intimate
      </button>

      <button onClick={() => fire("applyStyle", { style: "omniscient" })}>
        Omniscient
      </button>

      <button onClick={() => fire("generateNextBeat")}>
        Next Beat
      </button>
    </div>
  );
};

export default LotusCommandPanel;
