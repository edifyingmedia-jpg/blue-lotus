import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    // TEMPORARY: Real Supabase auth comes in Phase 2
    if (password === confirm && email) {
      navigate("/onboarding");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#05050a] text-white flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-cyan-500/10 blur-3xl" />

      <div className="relative w-full max-w-md bg-[#0a0a12]/60 backdrop-blur-xl p-10 rounded-2xl border border-white/10 shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-8">Create Your Account</h1>

        <form onSubmit={handleSignup} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm mb-2 text-gray-300">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:border-pink-400 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-300">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:border-purple-400 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-300">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:border-cyan-400 outline-none"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-pink-500 hover:bg-pink-400 text-black font-semibold transition"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-6 text-gray-400">
          Already have an account{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-cyan-400 hover:text-cyan-300 font-medium"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}
