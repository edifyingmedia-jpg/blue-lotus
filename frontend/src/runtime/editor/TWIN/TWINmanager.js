import React, { useEffect, useRef, useState } from "react";
import EventBus from "../engine/EventBus";

/**
 * TWINManager
 * Floating lotus AI assistant for Blue Lotus
 * - Pulse → Mini-expand → Bloom animation chain
 * - Auto-avoidance (never blocks workspace center)
 * - Working / Done states
 * - Voice output (speechSynthesis)
 * - EventBus integration
 */

const TWINManager = () => {
  const lotusRef = useRef(null);
  const [state, setState] = useState("idle"); 
  const [position, setPosition] = useState({ x: 40, y: 40 });
  const eventBusRef = useRef(null);

  // -----------------------------
  // 1. Initialize EventBus
  // -----------------------------
  useEffect(() => {
    eventBusRef.current = new EventBus();

    // Listen for TWIN actions
    eventBusRef.current.on("TWIN:speak", handleSpeak);
    eventBusRef.current.on("TWIN:working", () => setState("working"));
    eventBusRef.current.on("TWIN:done", () => setState("done"));

    return () => {
      eventBusRef.current.off("TWIN:speak", handleSpeak);
      eventBusRef.current.off("TWIN:working");
      eventBusRef.current.off("TWIN:done");
    };
  }, []);

  // -----------------------------
  // 2. Voice Output
  // -----------------------------
  const handleSpeak = (text) => {
    if (!text) return;

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 1;
    utter.volume = 1;

    // Soft, warm, neutral voice
    const voices = speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.toLowerCase().includes("female") ||
      v.name.toLowerCase().includes("soft") ||
      v.name.toLowerCase().includes("warm")
    );
    if (preferred) utter.voice = preferred;

    speechSynthesis.speak(utter);
  };

  // -----------------------------
  // 3. Auto-Avoidance Logic
  // -----------------------------
  useEffect(() => {
    const handleMouseMove = (e) => {
      const lotus = lotusRef.current;
      if (!lotus) return;

      const rect = lotus.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);

      // If cursor gets too close, move TWIN away
      if (distance < 120) {
        const angle = Math.atan2(dy, dx);
        const newX = position.x - Math.cos(angle) * 40;
        const newY = position.y - Math.sin(angle) * 40;

        setPosition({
          x: Math.min(window.innerWidth - 120, Math.max(20, newX)),
          y: Math.min(window.innerHeight - 120, Math.max(20, newY)),
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [position]);

  // -----------------------------
  // 4. Animation State Classes
  // -----------------------------
  const getAnimationClass = () => {
    switch (state) {
      case "working":
        return "twin-working";
      case "done":
        return "twin-done";
      default:
        return "twin-idle";
    }
  };

  // -----------------------------
  // 5. Render
  // -----------------------------
  return (
    <div
      ref={lotusRef}
      className={`twin-lotus ${getAnimationClass()}`}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        width: 90,
        height: 90,
        zIndex: 9999,
        pointerEvents: "none",
        transition: "left 0.25s ease, top 0.25s ease",
      }}
    >
      {/* Lotus Visual */}
      <div className="twin-lotus-core" />
    </div>
  );
};

export default TWINManager;

/* ---------------------------------------------------------
   CSS (inline for now — move to TWINManager.css if needed)
--------------------------------------------------------- */

const style = document.createElement("style");
style.innerHTML = `
.twin-lotus {
  display: flex;
  align-items: center;
  justify-content: center;
}

.twin-lotus-core {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: radial-gradient(circle, #ff9cff, #b45cff, #6a2cff);
  box-shadow: 0 0 20px #ff9cff, 0 0 40px #b45cff;
  animation: twin-pulse 3s infinite ease-in-out;
}

/* Idle Pulse */
@keyframes twin-pulse {
  0% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(1.08); filter: brightness(1.2); }
  100% { transform: scale(1); filter: brightness(1); }
}

/* Working Animation */
.twin-working .twin-lotus-core {
  animation: twin-working 1.2s infinite ease-in-out;
}

@keyframes twin-working {
  0% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(1.15); filter: brightness(1.4); }
  100% { transform: scale(1); filter: brightness(1); }
}

/* Done Animation */
.twin-done .twin-lotus-core {
  animation: twin-done 0.8s ease-out forwards;
}

@keyframes twin-done {
  0% { transform: scale(1); filter: brightness(1); }
  100% { transform: scale(1.25); filter: brightness(1.6); }
}
`;
document.head.appendChild(style);
