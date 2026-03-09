import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { description } = req.body;

  if (!description || description.trim() === "") {
    return res.status(400).json({ error: "Missing description" });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `
      Convert this app description into a structured JSON blueprint.
      Include:
      - pages[]
      - components[]
      - navigation
      - data model
      - API endpoints
      - required state
      - any relationships between screens

      Description: ${description}
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const blueprint = JSON.parse(completion.choices[0].message.content);

    return res.status(200).json({ blueprint });
  } catch (err) {
    console.error("Blueprint generation error:", err);
    return res.status(500).json({ error: "Blueprint generation failed" });
  }
}

