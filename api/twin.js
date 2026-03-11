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

    const result = await model.generateContent(message);
    const text = result.response.text();

    return res.status(200).json({ output: text });
  } catch (error) {
    console.error("TWIN Gemini error:", error);
    return res.status(500).json({
      error: "TWIN could not process your request.",
    });
  }
}
