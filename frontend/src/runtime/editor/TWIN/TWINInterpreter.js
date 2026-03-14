// frontend/src/runtime/editor/TWIN/TWINInterpreter.js

/**
 * TWIN Interpreter
 * ----------------
 * Converts raw user messages into structured intent objects.
 *
 * This module does NOT:
 * - enforce boundaries (Personality handles that)
 * - decide actions (ActionRouter handles that)
 * - execute anything (TWINmanager handles that)
 *
 * It ONLY interprets meaning.
 */

const TWINInterpreter = (() => {

  // ---------------------------------------------------------
  // 1. Keyword Maps (expandable)
  // ---------------------------------------------------------
  const keywordMap = {
    improve: ["improve", "optimize", "fix", "clean up", "refine", "polish"],
    explain: ["explain", "what does", "why does", "how does", "meaning"],
    build: ["create", "add", "generate", "make", "construct"],
    edit: ["edit", "change", "modify", "adjust", "update"],
    delete: ["delete", "remove", "clear", "erase"],
    align: ["align", "center", "distribute", "straighten"],
    navigate: ["go to", "open", "show me", "navigate"],
    select: ["select", "highlight", "choose"],
    resize: ["resize", "scale", "bigger", "smaller"],
    style: ["color", "font", "style", "theme", "appearance"]
  };

  // ---------------------------------------------------------
  // 2. Intent Detection
  // ---------------------------------------------------------
  function detectIntent(userMessage = "") {
    const lower = userMessage.toLowerCase();

    for (const [intent, keywords] of Object.entries(keywordMap)) {
      if (keywords.some(k => lower.includes(k))) {
        return intent;
      }
    }

    return "unknown";
  }

  // ---------------------------------------------------------
  // 3. Extract Targets (very lightweight)
  // ---------------------------------------------------------
  function extractTarget(userMessage = "") {
    // This is intentionally simple and safe.
    // Future versions can expand with NLP if needed.
    const lower = userMessage.toLowerCase();

    if (lower.includes("button")) return "button";
    if (lower.includes("image")) return "image";
    if (lower.includes("text")) return "text";
    if (lower.includes("section")) return "section";
    if (lower.includes("component")) return "component";

    return null;
  }

  // ---------------------------------------------------------
  // 4. Extract Parameters (simple pattern matching)
  // ---------------------------------------------------------
  function extractParameters(userMessage = "") {
    const params = {};

    // Size adjustments
    if (userMessage.includes("bigger")) params.size = "increase";
    if (userMessage.includes("smaller")) params.size = "decrease";

    // Color changes
    const colorMatch = userMessage.match(/\b(red|blue|green|black|white|yellow|purple|pink)\b/i);
    if (colorMatch) params.color = colorMatch[0].toLowerCase();

    return params;
  }

  // ---------------------------------------------------------
  // 5. Main Interpreter
  // ---------------------------------------------------------
  function interpret(userMessage = "") {
    const intent = detectIntent(userMessage);
    const target = extractTarget(userMessage);
    const params = extractParameters(userMessage);

    return {
      raw: userMessage,
      intent,
      target,
      params
    };
  }

  // ---------------------------------------------------------
  // 6. Exports
  // ---------------------------------------------------------
  return {
    interpret,
    detectIntent,
    extractTarget,
    extractParameters
  };

})();

export default TWINInterpreter;
