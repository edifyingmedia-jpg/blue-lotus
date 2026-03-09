import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { blueprint, projectId } = req.body;

  if (!blueprint) {
    return res.status(400).json({ error: "Missing blueprint" });
  }

  if (!projectId) {
    return res.status(400).json({ error: "Missing projectId" });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `
      Generate a full-stack app bundle based on this blueprint.
      Include:
      - React components
      - Routing
      - API handlers
      - Data model
      - Supabase integration
      - File structure

      Blueprint: ${JSON.stringify(blueprint)}
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const bundle = JSON.parse(completion.choices[0].message.content);

    // Save to Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { error } = await supabase
      .from("projects")
      .update({ app_bundle: bundle })
      .eq("id", projectId);

    if (error) {
      console.error("Supabase save error:", error);
      return res.status(500).json({ error: "Failed to save bundle" });
    }

    return res.status(200).json({ bundle });
  } catch (err) {
    console.error("Bundle generation error:", err);
    return res.status(500).json({ error: "Bundle generation failed" });
  }
}

