import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#05050a] text-white overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="w-full min-h-screen flex flex-col items-center justify-center px-6 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight drop-shadow-lg">
          Build. Create. Own.
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl">
          Blue Lotus gives creators the power to build apps visually, guided by
          intelligent tools — and own every line of output.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition"
          >
            Get Started
          </button>

          <button
            onClick={() => navigate("/pricing")}
            className="px-8 py-3 rounded-lg border border-white/30 hover:border-white/60 transition"
          >
            Explore Pricing
          </button>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="py-24 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
        {[
          {
            title: "Build Visually",
            desc: "Design apps with an intuitive visual editor built for creators.",
          },
          {
            title: "AI‑Assisted Creation",
            desc: "Generate layouts, components, and flows with intelligent guidance.",
          },
          {
            title: "Full Ownership",
            desc: "Export real code and keep complete control of your work.",
          },
        ].map((item, i) => (
          <div key={i} className="text-center">
            <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
            <p className="text-gray-400">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 bg-[#0a0a12]">
        <h2 className="text-4xl font-bold text-center mb-16">
          How It Works
        </h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12">
          {[
            {
              step: "01",
              title: "Create a Project",
              desc: "Start fresh or choose a guided template.",
            },
            {
              step: "02",
              title: "Build Visually",
              desc: "Use the editor to design screens, flows, and logic.",
            },
            {
              step: "03",
              title: "Publish & Own",
              desc: "Export real code and deploy anywhere you choose.",
            },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-cyan-400 text-5xl font-bold mb-4">
                {item.step}
              </div>
              <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-4xl font-bold mb-6">Flexible Plans</h2>
        <p className="text-gray-400 max-w-xl mx-auto mb-10">
          Choose the plan that fits your creative journey.
        </p>

        <button
          onClick={() => navigate("/pricing")}
          className="px-10 py-4 rounded-lg bg-purple-500 hover:bg-purple-400 text-black font-semibold transition"
        >
          View Pricing
        </button>
      </section>

      {/* FINAL CTA */}
      <footer className="py-24 px-6 text-center bg-[#05050a]">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Start building your world.
        </h2>

        <button
          onClick={() => navigate("/signup")}
          className="px-10 py-4 rounded-lg bg-pink-500 hover:bg-pink-400 text-black font-semibold transition"
        >
          Get Started
        </button>
      </footer>
    </div>
  );
}
