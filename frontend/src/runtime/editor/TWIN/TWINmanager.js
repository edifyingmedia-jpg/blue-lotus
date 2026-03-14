// frontend/src/runtime/editor/TWIN/TWINManager.js
// Full implementation — React + CSS animations + SpeechSynthesis + EventBus

import { useEffect, useRef, useState } from "react";
import EventBus from "../EventBus";
import "../TWIN/twinAnimations.css"; // You will create this file next

/**
 * TWINManager
 * Controls:
 * - Lotus animations (3 tiers)
 * - Deep build bloom mode
 * - Reveal sequence
 * - Voice output
 * - Auto-avoidance
 * - EventBus communication
 */

export default function TWINManager({ children }) {
  const [state, setState] = useState("idle");
  const [animationTier, setAnimationTier] = useState(0);
  const [isBlooming, setIsBlooming] = useState(false);
  const [buildMessage, setBuildMessage] = useState("");
  const lotusRef = useRef(null);

  // -----------------------------
  // EVENTBUS LISTENERS
  // -----------------------------
  useEffect(() => {
    EventBus.on("TWIN:microAdjust", handleMicroAdjust);
    EventBus.on("TWIN:miniBuild", handleMiniBuild);
    EventBus.on("TWIN:deepBuild", handleDeepBuild);
    EventBus.on("TWIN:completeBuild", handleCompleteBuild);

    return () => {
      EventBus.off("TWIN:microAdjust", handleMicroAdjust);
      EventBus.off("TWIN:miniBuild", handleMiniBuild);
      EventBus.off("TWIN:deepBuild", handleDeepBuild);
      EventBus.off("TWIN:completeBuild", handleCompleteBuild);
    };
  }, []);

  // -----------------------------
  // ANIMATION TIER HANDLERS
  // -----------------------------
  function handleMicroAdjust() {
    setAnimationTier(1);
    setState("microAdjust");
    triggerPulse();
  }

  function handleMiniBuild(message) {
    setAnimationTier(2);
    setState("miniBuild");
    setBuildMessage(message || "Building...");
    triggerMiniExpand();
  }

  function handleDeepBuild(message) {
    setAnimationTier(3);
    setState("deepBuild");
    setBuildMessage(message || "Building...");
    triggerBloom();
  }

  function handleCompleteBuild(message) {
    setState("revealing");
    setBuildMessage(message || "Completed.");
    triggerReveal();
  }

  // -----------------------------
  // ANIMATION LOGIC
  // -----------------------------
  function triggerPulse() {
    const lotus = lotusRef.current;
    if (!lotus) return;
    lotus.classList.add("lotus-pulse");
    setTimeout(() => lotus.classList.remove("lotus-pulse"), 400);
  }

  function triggerMiniExpand() {
    const lotus = lotusRef.current;
    if (!lotus) return;
    lotus.classList.add("lotus-mini-expand");
    setTimeout(() => lotus.classList.remove("lotus-mini-expand"), 800);
  }

  function triggerBloom() {
    setIsBlooming(true);
    speak(`Starting build. ${buildMessage}`);
  }

  function triggerReveal() {
    setTimeout(() => {
      setIsBlooming(false);
      playChime();
      speak(buildMessage);
      setState("idle");
    }, 1200);
  }

  // -----------------------------
  // VOICE SYSTEM
  // -----------------------------
  function speak(text) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 1;
    utter.volume = 1;
    speechSynthesis.speak(utter);
  }

  // -----------------------------
  // COMPLETION CHIME
  // -----------------------------
  function playChime() {
    const audio = new Audio("/sounds/twing-ting.mp3"); // Add this file later
    audio.volume = 0.6;
    audio.play();
  }

  // -----------------------------
  // AUTO-AVOIDANCE (simple version)
  // -----------------------------
  useEffect(() => {
    function handleMouseMove(e) {
      const lotus = lotusRef.current;
      if (!lotus) return;

      const rect = lotus.getBoundingClientRect();
      const distance = Math.abs(e.clientY - rect.top);

      if (distance < 80) {
        lotus.style.opacity = "0.4";
        lotus.style.transform = "translateY(10px)";
      } else {
        lotus.style.opacity = "1";
        lotus.style.transform = "translateY(0)";
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <>
      {/* Lotus Icon */}
      <div
        ref={lotusRef}
        className={`twin-lotus ${isBlooming ? "lotus-bloom" : ""}`}
      ></div>

      {/* Bloom Overlay */}
      {isBlooming && (
        <div className="twin-bloom-overlay">
          <div className="twin-bloom-text">{buildMessage}</div>
        </div>
      )}

      {children}
    </>
  );
}
