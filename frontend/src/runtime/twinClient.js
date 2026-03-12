// frontend/src/runtime/twinClient.js

export async function askTwin(message) {
  const response = await fetch("/api/twin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`TWIN request failed: ${errorText}`);
  }

  const data = await response.json();
  return data.output;
}
