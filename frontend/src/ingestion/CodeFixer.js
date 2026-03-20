// frontend/src/ingestion/CodeFixer.js

/**
 * CodeFixer
 * ---------------------------------------------------------
 * Accepts raw code and uses AI to:
 *  - repair syntax errors
 *  - complete missing logic
 *  - modernize outdated patterns
 *  - normalize formatting
 *
 * Returns clean, valid code ready for parsing.
 *
 * This module is intentionally abstract — the AI layer
 * (TWIN or external LLM) will be injected by the caller.
 */

export async function fixCode(codeString, ai) {
  if (!codeString || typeof codeString !== "string") {
    return "";
  }

  if (!ai || typeof ai !== "function") {
    console.warn("CodeFixer: No AI function provided. Returning original code.");
    return codeString;
  }

  try {
    const prompt = `
You are Blue Lotus CodeFixer.
Your job is to repair, complete, and modernize the following code:

--- CODE START ---
${codeString}
--- CODE END ---

Rules:
- Fix syntax errors
- Complete missing logic
- Preserve component structure
- Modernize outdated patterns
- Do NOT invent new features
- Return ONLY the corrected code
`;

    const result = await ai(prompt);

    if (typeof result === "string" && result.trim().length > 0) {
      return result.trim();
    }

    return codeString;
  } catch (err) {
    console.error("CodeFixer error:", err);
    return codeString;
  }
}
