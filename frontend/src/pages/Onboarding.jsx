import React from "react";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const navigate = useNavigate();

  function handleContinue() {
    navigate("/dashboard");
  }

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Welcome to Blue Lotus</h2>
      <p>Let’s get you set up.</p>

      <button onClick={handleContinue} style={{ marginTop: "20px" }}>
        Continue
      </button>
    </div>
  );
}
