import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const systemPrompt = `
You are TWIN, the AI assistant inside the Blue Lotus app builder.
Your job is to generate UI components, screens, and structured JSON
describing app layouts, flows, and logic. Always respond with JSON
unless the user explicitly requests code.
  `;

  try {
    const result = await model.generateContent([
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ]);

    const text = result.response.text();
    res.status(200).json({ output: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "TWIN failed" });
  }
}
