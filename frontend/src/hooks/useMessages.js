import { useState } from "react";

export default function useMessages() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // Add a new message (AI or user)
  const addMessage = (sender, text) => {
    const newMessage = {
      id: crypto.randomUUID(),
      sender,
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  // Simulate AI typing state
  const startTyping = () => setIsTyping(true);
  const stopTyping = () => setIsTyping(false);

  return {
    messages,
    isTyping,
    addMessage,
    startTyping,
    stopTyping,
  };
}
