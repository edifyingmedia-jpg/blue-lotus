import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../runtime/auth";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    const { data, error } = await signUp({ email, password });

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/screen/dashboard");
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Create Account</h1>

      <form onSubmit={handleRegister} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button}>
          Register
        </button>
      </form>

      <p style={styles.linkText}>
        Already have an account?{" "}
        <span
          style={styles.link}
          onClick={() => navigate("/screen/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "80px auto",
    padding: "20px",
    textAlign: "center",
  },
  title: {
    fontSize: "28px",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#6C5CE7",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
  linkText: {
    marginTop: "16px",
    fontSize: "14px",
  },
  link: {
    color: "#6C5CE7",
    cursor: "pointer",
    textDecoration: "underline",
  },
};
