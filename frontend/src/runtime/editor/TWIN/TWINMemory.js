// frontend/src/runtime/editor/TWIN/TWINMemory.js

/**
 * TWINMemory.js
 * -------------------------------------------
 * Lightweight, project‑aware memory system for TWIN.
 *
 * This module stores:
 * - recent user messages (short-term)
 * - project context (elements, goals, tasks)
 * - last actions
 * - last suggestions
 *
 * It does NOT store:
 * - personal information
 * - private data
 * - sensitive content
 * - anything about the creator/owner
 *
 * Memory resets when the project resets.
 */

const TWINMemory = (() => {

  // ---------------------------------------------------------
  // 1. Internal Memory State
  // ---------------------------------------------------------
  const state = {
    recentMessages: [],      // last 10 user messages
    projectNotes: {},        // arbitrary project-level notes
    lastAction: null,        // last executed action
    lastSuggestions: [],     // last improvement suggestions
    lastIntent: null         // last interpreted intent
  };

  // ---------------------------------------------------------
  // 2. Add User Message (short-term memory)
  // ---------------------------------------------------------
  function addMessage(message = "") {
    if (!message) return;

    state.recentMessages.push(message);

    // Keep memory lightweight
    if (state.recentMessages.length > 10) {
      state.recentMessages.shift();
    }
  }

  // ---------------------------------------------------------
  // 3. Store Last Action
  // ---------------------------------------------------------
  function setLastAction(action) {
    state.lastAction = action;
  }

  // ---------------------------------------------------------
  // 4. Store Last Suggestions
  // ---------------------------------------------------------
  function setLastSuggestions(suggestions = []) {
    state.lastSuggestions = suggestions;
  }

  // ---------------------------------------------------------
  // 5. Store Last Intent
  // ---------------------------------------------------------
  function setLastIntent(intent) {
    state.lastIntent = intent;
  }

  // ---------------------------------------------------------
  // 6. Project Notes (safe, non-personal)
  // ---------------------------------------------------------
  function setProjectNote(key, value) {
    if (!key) return;
    state.projectNotes[key] = value;
  }

  function getProjectNote(key) {
    return state.projectNotes[key] || null;
  }

  // ---------------------------------------------------------
  // 7. Reset Memory (when project resets)
  // ---------------------------------------------------------
  function reset() {
    state.recentMessages = [];
    state.projectNotes = {};
    state.lastAction = null;
    state.lastSuggestions = [];
    state.lastIntent = null;
  }

  // ---------------------------------------------------------
  // 8. Exported API
  // ---------------------------------------------------------
  return {
    // state access
    state,

    // message memory
    addMessage,

    // action memory
    setLastAction,

    // suggestion memory
    setLastSuggestions,

    // intent memory
    setLastIntent,

    // project notes
    setProjectNote,
    getProjectNote,

    // reset
    reset
  };

})();

export default TWINMemory;
