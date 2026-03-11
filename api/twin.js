// frontend/src/pages/api/twin.js
// Temporary backend route for TWIN — replace with real model later

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message is required." });
  }

  // Placeholder response — replace with real AI call later
  const fakeResponse = `TWIN received: "${message}"\n\nThis is a placeholder response until your model is connected.`;

  return res.status(200).json({
    output: fakeResponse,
  });
}
