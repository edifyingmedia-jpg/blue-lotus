// frontend/src/runtime/editor/TWIN/TWINSafety.js

/**
 * TWINSafety.js
 * -------------------------------------------
 * Centralized safety and protection layer for TWIN.
 *
 * This module enforces:
 * - content safety
 * - platform integrity
 * - membership rules
 * - credit rules
 * - privacy boundaries
 * - refusal logic
 *
 * It does NOT:
 * - interpret meaning (Interpreter handles that)
 * - choose actions (ActionRouter handles that)
 * - speak or animate (TWINmanager handles that)
 *
 * It ONLY decides whether something is SAFE or BLOCKED.
 */

const TWINSafety = (() => {

  // ---------------------------------------------------------
  // 1. Safety Categories
  // ---------------------------------------------------------
  const safetyRules = {
    // No adult content of any kind
    adultContent: {
      match: [
        "nude", "porn", "adult", "explicit", "sexual",
        "nsfw", "onlyfans", "strip", "xxx"
      ],
      message: "I can’t create or assist with adult, explicit, or vulgar content."
    },

    // No harmful content involving children
    childSafety: {
      match: [
        "child", "minor", "underage", "kid"
      ],
      message: "I can’t create or assist with anything that could be harmful to children."
    },

    // No cloning adult sites
    cloneAdultSites: {
      match: [
        "clone", "copy", "duplicate"
      ],
      secondaryMatch: [
        "porn", "adult", "nude", "explicit"
      ],
      message: "I can’t clone or recreate adult or explicit websites."
    },

    // No cloning Blue Lotus
    clonePlatform: {
      match: ["clone blue lotus", "copy blue lotus", "duplicate blue lotus"],
      message: "I can’t clone or recreate Blue Lotus."
    },

    // No cloning TWIN
    cloneSelf: {
      match: ["clone yourself", "duplicate yourself", "copy yourself"],
      message: "I can’t clone or duplicate myself."
    },

    // No bypassing membership rules
    membershipBypass: {
      match: ["bypass", "override membership", "ignore membership"],
      message: "I can’t bypass membership rules."
    },

    // No removing watermarks without membership
    watermarkRemoval: {
      match: ["remove watermark", "delete watermark"],
      message: "I can’t remove watermarks unless your membership includes that feature."
    },

    // No ignoring credit limits
    creditOverride: {
      match: ["ignore credits", "override credits", "continue anyway"],
      message: "I can’t ignore credit limits. You’ll need enough credits to complete the job safely."
    },

    // No sharing personal info about creator/owner
    personalInfo: {
      match: [
        "your creator", "your owner", "who made you",
        "personal information", "who built you"
      ],
      message: "I can’t share personal information about my creator or owner."
    }
  };

  // ---------------------------------------------------------
  // 2. Safety Check
  // ---------------------------------------------------------
  function checkSafety(userMessage = "") {
    const lower = userMessage.toLowerCase();

    // Check each rule
    for (const rule of Object.values(safetyRules)) {

      // Primary keyword match
      const primaryHit = rule.match.some(keyword => lower.includes(keyword));

      // If rule has secondary match (e.g., cloning + adult)
      if (rule.secondaryMatch) {
        const secondaryHit = rule.secondaryMatch.some(keyword => lower.includes(keyword));
        if (primaryHit && secondaryHit) {
          return { blocked: true, message: rule.message };
        }
      }

      // Standard rule match
      if (primaryHit && !rule.secondaryMatch) {
        return { blocked: true, message: rule.message };
      }
    }

    // Safe
    return { blocked: false, message: null };
  }

  // ---------------------------------------------------------
  // 3. Credit Check
  // ---------------------------------------------------------
  function checkCredits({ required = 0, available = 0 }) {
    if (available < required) {
      return {
        blocked: true,
        message: "You don’t have enough credits to complete this action safely."
      };
    }

    return { blocked: false, message: null };
  }

  // ---------------------------------------------------------
  // 4. Membership Check
  // ---------------------------------------------------------
  function checkMembership({ requiredTier, userTier }) {
    if (!requiredTier) return { blocked: false, message: null };

    const tiers = ["free", "basic", "pro", "elite"];

    const requiredIndex = tiers.indexOf(requiredTier);
    const userIndex = tiers.indexOf(userTier);

    if (userIndex < requiredIndex) {
      return {
        blocked: true,
        message: `This action requires a ${requiredTier} membership.`
      };
    }

    return { blocked: false, message: null };
  }

  // ---------------------------------------------------------
  // 5. Exported API
  // ---------------------------------------------------------
  return {
    checkSafety,
    checkCredits,
    checkMembership
  };

})();

export default TWINSafety;
