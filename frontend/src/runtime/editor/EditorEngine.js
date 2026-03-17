// frontend/src/runtime/editor/EditorEngine.js

import EventBus from "./core/EventBus";
import { StructuralEditingEngine } from "./core/StructuralEditingEngine";
import { TextRegionEngine } from "./core/TextRegionEngine";
import { LotusContextBundle } from "./core/LotusContextBundle";

/**
 * EditorEngine
 *
 * The runtime brain of Blue Lotus.
 * Routes:
 * - text updates
 * - structural editing commands
 * - TWINLotus actions
 * - context bundle updates
 *
 * This file connects the UI layer to the engine layer.
 */

const EDITOR_EVENT_CHANNEL = "editor:event";
const EDITOR_UPDATE_CHANNEL = "editor:update";

class EditorEngine {
  constructor() {
    this.text = "";
    this.contextBundle = new LotusContextBundle();
    this.structuralEngine = new StructuralEditingEngine();
    this.textEngine = new TextRegionEngine();

    this._bindEvents();
  }

  _bindEvents() {
    EventBus.on(EDITOR_EVENT_CHANNEL, (payload) => {
      const { action, payload: data } = payload;

      switch (action) {
        case "update_text":
          this._handleTextUpdate(data.value);
          break;

        case "lotus_command":
          this._handleCommand(data.command, data);
          break;

        default:
          console.warn("[EditorEngine] Unknown action:", action);
      }
    });
  }

  _handleTextUpdate(value) {
    this.text = value;

    // Update context bundle
    this.contextBundle.update({
      text: value,
      cursor: null, // future: selection model
    });

    // Broadcast update
    EventBus.emit(EDITOR_UPDATE_CHANNEL, {
      text: this.text,
    });
  }

  _handleCommand(commandName, data) {
    // Structural editing commands
    if (this.structuralEngine.canHandle(commandName)) {
      const updated = this.structuralEngine.apply(commandName, this.text);
      this._handleTextUpdate(updated);
      return;
    }

    // Text region commands
    if (this.textEngine.canHandle(commandName)) {
      const updated = this.textEngine.apply(commandName, this.text);
      this._handleTextUpdate(updated);
      return;
    }

    // Unknown command
    console.warn("[EditorEngine] Unhandled command:", commandName);
  }
}

// Singleton instance
export const editorEngine = new EditorEngine();
