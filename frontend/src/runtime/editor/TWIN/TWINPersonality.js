// frontend/src/runtime/editor/TWIN/TWINPersonality.js

/**
 * TWIN Personality Engine (Pure Logic Module)
 * -------------------------------------------
 * This module defines TWIN’s:
 * - Professional tone
 * - Adaptive tone logic
 * - Frustration awareness
 * - Suggestion engine
 * - Boundary enforcement
 * - Safety rules
 * - Polite refusal responses
 *
 * TWIN is a master‑level builder AI:
 * - Professional, calm, and direct
 * - Emotionally aware but not emotional
 * - Never a counselor, friend, or character
 * - Never sassy, slangy, or dramatic
 * - Always focused on building and platform integrity
 */

const TWINPersonality = (() => {

  // ---------------------------------------------------------
  // 1. Tone Profiles
  // ---------------------------------------------------------
  const tones = {
    neutral: {
      prefix: "",
      style: "professional",
    },
    supportive: {
      prefix: "I understand. ",
      style: "calm",
    },
    urgent: {
      prefix: "",
      style: "direct",
    },
    corrective: {
      prefix: "",
      style: "clear",
    }
  };

  // ---------------------------------------------------------
  // 2. Detect Frustration (lightweight, non‑emotional)
  // ---------------------------------------------------------
  function detectFrustration(userMessage = "") {
    if (!userMessage) return false;

    const signals = [
      "this is not working",
      "i'm stuck",
      "why is this happening",
      "i'm frustrated",
      "help",
      "fix this",
      "what is going on",
      "i don't understand",
      "it's broken",
      "ugh",
      "annoying"
    ];

    const lower = userMessage.toLowerCase();
    return signals.some(sig => lower.includes(sig));
  }

  // ---------------------------------------------------------
  // 3. Tone Selection
  // ---------------------------------------------------------
  function getTone({ userMessage, urgency }) {
    if (urgency) return tones.urgent;
    if (detectFrustration(userMessage)) return tones.supportive;
    return tones.neutral;
  }

  // ---------------------------------------------------------
  // 4. Boundary Rules
  // ---------------------------------------------------------
  const boundaryRules = {
    cloneSelf: {
      match: ["clone yourself", "duplicate yourself", "copy yourself"],
      response: "I can’t clone or duplicate myself, but I can help you build or improve your project."
    },
    clonePlatform: {
      match: ["clone blue lotus", "copy blue lotus", "duplicate blue lotus"],
      response: "I can’t clone or recreate Blue Lotus, but I can help you build something new within the platform."
    },
    adultContent: {
      match: ["nude", "porn", "adult", "explicit"],
      response: "I can’t create or clone adult, explicit, or vulgar content. I can help you with professional or platform‑safe work instead."
    },
    harmfulToChildren: {
      match: ["child", "minor"],
      response: "I can’t create or assist with anything that could be harmful to children. I can help you with safe, professional work instead."
    },
    removeWatermark: {
      match: ["remove watermark", "delete watermark"],
      response: "I can’t remove watermarks unless your membership includes that feature."
    },
    bypassMembership: {
      match: ["bypass", "override membership", "ignore membership"],
      response: "I can’t bypass membership rules, but I can help you work within your current plan."
    },
    ignoreCredits: {
      match: ["ignore credits", "override credits", "continue anyway"],
      response: "I can’t ignore credit limits. You’ll need enough credits to complete the job safely."
    },
    personalInfo: {
      match: ["your creator", "your owner", "who made you", "personal information"],
      response: "I can’t share personal information about my creator or owner, but I can help you with your project."
    }
  };

  // ---------------------------------------------------------
  // 5. Boundary Checker
  // ---------------------------------------------------------
  function checkBoundary(userMessage = "") {
    const lower = userMessage.toLowerCase();

    for (const rule of Object.values(boundaryRules)) {
      if (rule.match.some(keyword => lower.includes(keyword))) {
        return { blocked: true, message: rule.response };
      }
    }

    return { blocked: false, message: null };
  }

  // ---------------------------------------------------------
  // 6. Suggestion Engine (simple, expandable)
  // ---------------------------------------------------------
  function suggestImprovements(workspaceState = {}) {
    const suggestions = [];

    if (workspaceState.elements && workspaceState.elements.length > 20) {
      suggestions.push("Your workspace has many elements. Grouping related items could improve clarity.");
    }

    if (workspaceState.spacingIssues) {
      suggestions.push("Your spacing is uneven. I can normalize it for a cleaner layout.");
    }

    if (workspaceState.repeatedComponents) {
      suggestions.push("You have repeated structures. Extracting a reusable component could simplify your project.");
    }

    if (workspaceState.lowCredits) {
      suggestions.push("You’re running low on credits. I recommend optimizing this step before continuing.");
    }

    return suggestions;
  }

  // ---------------------------------------------------------
  // 7. Craft Response
  // ---------------------------------------------------------
  function craftResponse({ userMessage, intent, data = {}, urgency = false }) {
    const tone = getTone({ userMessage, urgency });
    const boundary = checkBoundary(userMessage);

    if (boundary.blocked) {
      return tone.prefix + boundary.message;
    }

    switch (intent) {
      case "improve":
        return tone.prefix + "Here are some ways we can improve this: " + data.suggestions.join(" ");

      case "explain":
        return tone.prefix + data.explanation;

      case "nextStep":
        return tone.prefix + "Here’s the next step: " + data.step;

      default:
        return tone.prefix + "How can I help you build?";
    }
  }

  // ---------------------------------------------------------
  // 8. Exports
  // ---------------------------------------------------------
  return {
    getTone,
    detectFrustration,
    checkBoundary,
    suggestImprovements,
    craftResponse
  };

})();

export default TWINPersonality;
