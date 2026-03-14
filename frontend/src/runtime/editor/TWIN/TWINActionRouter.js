// frontend/src/runtime/editor/TWIN/TWINActionRouter.js

/**
 * TWIN Action Router
 * ------------------
 * This module decides WHAT TWIN should do based on:
 * - user message
 * - interpreted intent
 * - personality boundaries
 * - workspace state
 *
 * It does NOT execute actions.
 * It only returns structured instructions for TWINmanager.
 */

import TWINPersonality from "./TWINPersonality.js";

const TWINActionRouter = (() => {

  // ---------------------------------------------------------
  // 1. Intent Categories
  // ---------------------------------------------------------
  const intentKeywords = {
    improve: ["improve", "optimize", "fix", "clean up", "make better"],
    explain: ["explain", "what does this do", "why", "how does this work"],
    edit: ["edit", "change", "modify", "adjust"],
    build: ["create", "add", "generate", "make"],
    navigate: ["go to", "open", "show me"],
    align: ["align", "center", "distribute"],
    delete: ["delete", "remove", "clear"],
  };

  function detectIntent(userMessage = "") {
    const lower = userMessage.toLowerCase();

    for (const [intent, keywords] of Object.entries(intentKeywords)) {
      if (keywords.some(k => lower.includes(k))) {
        return intent;
      }
    }

    return "unknown";
  }

  // ---------------------------------------------------------
  // 2. Action Builders (returned to TWINmanager)
  // ---------------------------------------------------------
  function speak(message) {
    return {
      type: "speak",
      message,
      action: null
    };
  }

  function execute(actionType, payload = {}) {
    return {
      type: "execute",
      action: { type: actionType, payload },
      message: null
    };
  }

  function refuse(message) {
    return {
      type: "refusal",
      message,
      action: null
    };
  }

  // ---------------------------------------------------------
  // 3. Main Routing Logic
  // ---------------------------------------------------------
  function route({ userMessage, workspaceState = {} }) {
    // 1. Check boundaries FIRST
    const boundary = TWINPersonality.checkBoundary(userMessage);
    if (boundary.blocked) {
      return refuse(boundary.message);
    }

    // 2. Detect intent
    const intent = detectIntent(userMessage);

    // 3. Handle known intents
    switch (intent) {

      // -----------------------------------------------------
      // IMPROVE
      // -----------------------------------------------------
      case "improve": {
        const suggestions = TWINPersonality.suggestImprovements(workspaceState);

        if (suggestions.length === 0) {
          return speak("Everything looks stable. What would you like to improve?");
        }

        const message = TWINPersonality.craftResponse({
          userMessage,
          intent: "improve",
          data: { suggestions }
        });

        return speak(message);
      }

      // -----------------------------------------------------
      // EXPLAIN
      // -----------------------------------------------------
      case "explain": {
        const explanation = workspaceState.explanation || "Here’s what this does.";

        const message = TWINPersonality.craftResponse({
          userMessage,
          intent: "explain",
          data: { explanation }
        });

        return speak(message);
      }

      // -----------------------------------------------------
      // ALIGN ELEMENTS
      // -----------------------------------------------------
      case "align": {
        return execute("alignElements", { mode: "auto" });
      }

      // -----------------------------------------------------
      // DELETE ELEMENTS
      // -----------------------------------------------------
      case "delete": {
        return execute("deleteSelection", {});
      }

      // -----------------------------------------------------
      // EDIT / MODIFY
      // -----------------------------------------------------
      case "edit": {
        return execute("editSelection", {});
      }

      // -----------------------------------------------------
      // BUILD / CREATE
      // -----------------------------------------------------
      case "build": {
        return execute("createElement", { type: "auto" });
      }

      // -----------------------------------------------------
      // NAVIGATE
      // -----------------------------------------------------
      case "navigate": {
        return execute("navigate", { target: userMessage });
      }

      // -----------------------------------------------------
      // UNKNOWN INTENT
      // -----------------------------------------------------
      default: {
        const message = TWINPersonality.craftResponse({
          userMessage,
          intent: "unknown",
          data: {}
        });

        return speak(message);
      }
    }
  }

  // ---------------------------------------------------------
  // 4. Exports
  // ---------------------------------------------------------
  return {
    route,
    detectIntent
  };

})();

export default TWINActionRouter;
