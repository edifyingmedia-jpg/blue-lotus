// frontend/src/runtime/editor/TWIN/TWINManager.js

/**
 * TWINManager.js
 * ---------------------------------------------------------
 * The central orchestrator for TWIN:
 * - Listens to user input
 * - Interprets meaning
 * - Checks safety
 * - Routes actions
 * - Executes editor commands
 * - Speaks responses
 * - Animates TWIN
 * - Stores memory
 *
 * This is the “body” that brings all modules together.
 */

import React, { useState, useEffect, useRef } from "react";

import TWINPersonality from "./TWINPersonality.js";
import TWINInterpreter from "./TWINInterpreter.js";
import TWINActionRouter from "./TWINActionRouter.js";
import TWINSafety from "./TWINSafety.js";
import TWINMemory from "./TWINMemory.js";
import TWINActionLibrary from "./TWINActionLibrary.js";

const TWINManager = ({ canvas }) => {

  // ---------------------------------------------------------
  // 1. State
  // ---------------------------------------------------------
  const [visible, setVisible] = useState(true);
  const [message, setMessage] = useState("How can I help you build?");
  const [isThinking, setIsThinking] = useState(false);

  const inputRef = useRef(null);

  // ---------------------------------------------------------
  // 2. Speak (UI output)
  // ---------------------------------------------------------
  function speak(text) {
    setMessage(text);
  }

  // ---------------------------------------------------------
  // 3. Animate TWIN (simple pulse)
  // ---------------------------------------------------------
  function animateThinking() {
    setIsThinking(true);
    setTimeout(() => setIsThinking(false), 600);
  }

  // ---------------------------------------------------------
  // 4. Handle User Message
  // ---------------------------------------------------------
  function handleUserMessage(userMessage) {
    if (!userMessage || userMessage.trim() === "") return;

    // Store message in memory
    TWINMemory.addMessage(userMessage);

    // Animate
    animateThinking();

    // SAFETY FIRST
    const safety = TWINSafety.checkSafety(userMessage);
    if (safety.blocked) {
      speak(safety.message);
      return;
    }

    // INTERPRET
    const interpretation = TWINInterpreter.interpret(userMessage);
    TWINMemory.setLastIntent(interpretation.intent);

    // ROUTE
    const routed = TWINActionRouter.route({
      userMessage,
      workspaceState: {
        elements: canvas?.getAllElements?.() || [],
        spacingIssues: canvas?.hasSpacingIssues?.() || false,
        repeatedComponents: canvas?.hasRepeatedComponents?.() || false,
        lowCredits: false // placeholder for future credit system
      }
    });

    // EXECUTE OR SPEAK
    if (routed.type === "execute" && routed.action) {
      TWINActionLibrary.execute(routed.action, { canvas });
      TWINMemory.setLastAction(routed.action);
    }

    if (routed.message) {
      speak(routed.message);
    }
  }

  // ---------------------------------------------------------
  // 5. Handle Enter Key
  // ---------------------------------------------------------
  function onKeyDown(e) {
    if (e.key === "Enter") {
      const value = inputRef.current.value;
      inputRef.current.value = "";
      handleUserMessage(value);
    }
  }

  // ---------------------------------------------------------
  // 6. Render TWIN UI
  // ---------------------------------------------------------
  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        right: "20px",
        width: "260px",
        padding: "16px",
        borderRadius: "12px",
        background: "rgba(0,0,0,0.65)",
        color: "white",
        fontFamily: "Inter, sans-serif",
        boxShadow: "0 0 20px rgba(0,255,255,0.3)",
        transition: "all 0.25s ease",
        transform: isThinking ? "scale(1.03)" : "scale(1.0)",
        opacity: visible ? 1 : 0
      }}
    >
      {/* TWIN Message */}
      <div style={{ marginBottom: "12px", fontSize: "14px", lineHeight: "1.4" }}>
        {message}
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        onKeyDown={onKeyDown}
        placeholder="Tell me what to do..."
        style={{
          width: "100%",
          padding: "8px 10px",
          borderRadius: "8px",
          border: "none",
          outline: "none",
          fontSize: "13px",
          background: "rgba(255,255,255,0.15)",
          color: "white"
        }}
      />
    </div>
  );
};

export default TWINManager;
