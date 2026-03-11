// frontend/src/runtime/twin/useTWIN.js
// Hook to manage TWIN textarea input + output + loading state

import { useState } from "react";
import { sendToTWIN } from "./TWINLogic";

export function useTWIN() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);

    const response = await sendToTWIN(input);

    if (response.success) {
      setOutput(response.output);
    } else {
      setOutput("TWIN could not process your request.");
    }

    setLoading(false);
  };

  return {
    input,
    setInput,
    output,
    loading,
    sendMessage,
  };
}
