import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // TEMPORARY: Replace with real auth later in rebuild Phase 2
    if (email && password) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#05050a] text-white flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />

      <div className="relative w-full max-w-md bg-[#0a0a12]/60 backdrop-blur-xl p-10 rounded-2xl border border-white/10 shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome Back</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm mb-2 text-gray-300">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:border-cyan-400 outline-none"
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

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition"
          >
            Log In
          </button>
        </form>

        <div className="text-center mt-6 text-gray-400">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-pink-400 hover:text-pink-300 font-medium"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
