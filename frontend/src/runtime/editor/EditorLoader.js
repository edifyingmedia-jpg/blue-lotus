// frontend/src/runtime/editor/EditorLoader.js

/**
 * EditorLoader
 *
 * Responsible for initializing the Blue Lotus editor runtime.
 * Handles:
 * - engine boot
 * - context bundle initialization
 * - future async project/document loading
 */

import { editorEngine } from "./EditorEngine";
import { LotusContextBundle } from "./core/LotusContextBundle";

class EditorLoader {
  constructor() {
    this.ready = false;
    this.contextBundle = new LotusContextBundle();
  }

  async init() {
    if (this.ready) return;

    // Initialize engine with empty context
    editorEngine.contextBundle = this.contextBundle;

    // Future: load project, scenes, metadata, notes, etc.
    // await this._loadProject();

    this.ready = true;
  }

  async _loadProject() {
    // Placeholder for future async loading
    return {
      text: "",
      metadata: {},
      scenes: [],
    };
  }
}

export const editorLoader = new EditorLoader();
