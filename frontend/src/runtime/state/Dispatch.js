/**
 * Dispatch.js
 * ----------------------------------------------------
 * Provides a unified dispatch function for triggering
 * actions in the runtime.
 *
 * This is a thin wrapper around ActionEngine.run(),
 * giving components a clean way to trigger actions.
 */

import ActionEngine from "./ActionEngine";

export default function Dispatch(actionId, payload = {}) {
  ActionEngine.run(actionId, payload);
}
