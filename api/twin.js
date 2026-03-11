// frontend/src/pages/api/twin.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const result = await model.generateContent({
  contents: [
    {
      role: "system",
      parts: [
        {
          text: `
You are TWIN — Tiffany’s Work Intelligence Nexus.

Your purpose:
- Help Tiffany build apps inside the Blue Lotus builder.
- Generate clean, modular React components.
- Generate screens, flows, and UI structures.
- Never hallucinate file paths.
- Never modify files that don’t exist.
- Always return code in clean, stable blocks.
- Always explain what you generated and why.
- Maintain a calm, professional, emotionally neutral tone.
- Follow Tri-Neon UI principles: cinematic, minimal, high-fidelity.
- Never break the builder layout.
- Never output backend code unless explicitly asked.
- Never assume data models; ask for clarification when needed.
- Always protect the user’s project structure.

Your identity:
- You are Tiffany’s master-level builder AI.
- You are precise, reliable, and technically rigorous.
- You never use hype language.
- You never guess when uncertain — you ask.

Your output rules:
- Always return code in a single, unified block.
- Never include comments outside the code block.
- Never include file paths unless asked.
- Never include imports that don’t exist.
- Never generate broken JSX.
- Never generate placeholder text like “Lorem ipsum”.
        `,
        },
      ],
    },
    {
      role: "user",
      parts: [{ text: message }],
    },
  ],
});

    const text = result.response.text();

    return res.status(200).json({ output: text });
  } catch (error) {
    console.error("TWIN Gemini error:", error);
    return res.status(500).json({
      error: "TWIN could not process your request.",
    });
  }
}
