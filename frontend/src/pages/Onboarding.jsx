import React from "react";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const navigate = useNavigate();

  const handleContinue = () => {
    // TEMPORARY: Real onboarding logic comes in Phase 2
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen w-full bg-[#05050a] text-white flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-cyan-500/10 to-pink-500/10 blur-3xl" />

      <div className="relative w-full max-w-xl bg-[#0a0a12]/60 backdrop-blur-xl p-12 rounded-2xl border border-white/10 shadow-xl text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Blue Lotus</h1>

        <p className="text-gray-300 text-lg max-w-md mx-auto mb-10">
          Before you begin, let’s set up your creative space.  
          This quick onboarding helps personalize your experience.
        </p>

        <button
          onClick={handleContinue}
          className="px-10 py-4 rounded-lg bg-purple-500 hover:bg-purple-400 text-black font-semibold transition"
        >
          Continue
        </button>

        <p className="text-gray-500 text-sm mt-6">
          You can always update your preferences later in Settings.
        </p>
      </div>
    </div>
  );
}
