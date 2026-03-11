// frontend/src/runtime/twin/TWINLogic.js
// Core TWIN logic layer — backend-agnostic, clean, stable

export async function sendToTWIN(userMessage) {
  try {
    // Placeholder: Replace with your actual model endpoint later
    const response = await fetch("/api/twin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
      }),
    });

    const data = await response.json();

    return {
      success: true,
      output: data.output || "TWIN responded with no content.",
    };
  } catch (error) {
    console.error("TWIN error:", error);

    return {
      success: false,
      output:
        "TWIN encountered an issue processing your request. Please try again.",
    };
  }
}
