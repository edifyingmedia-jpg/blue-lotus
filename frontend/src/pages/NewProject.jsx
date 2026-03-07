import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function NewProject() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function createProject(e) {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("projects").insert([
      {
        name,
        user_id: user.id,
      },
    ]);

    setLoading(false);

    if (!error) {
      navigate("/projects");
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Create New Project</h1>
      <p style={styles.subtext}>Start something new and cinematic.</p>

      <form onSubmit={createProject} style={styles.form}>
        <input
          type="text"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}

/* ---------------------------
   CINEMATIC TRI-NEON STYLES
---------------------------- */
const styles = {
  container: {
    padding: "50px",
    color: "white",
    backgroundColor: "#0a0f1f",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
  },

  heading: {
    fontSize: "36px",
    marginBottom: "10px",
    color: "#00eaff",
    textShadow: "0 0 12px rgba(0,255,255,0.5)",
  },

  subtext: {
    fontSize: "18px",
    opacity: 0.8,
    marginBottom: "30px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    maxWidth: "400px",
  },

  input: {
    padding: "14px",
    borderRadius: "8px",
    border: "1px solid rgba(0,255,255,0.3)",
    backgroundColor: "#11182f",
    color: "white",
    fontSize: "16px",
  },

  button: {
    padding: "14px",
    borderRadius: "8px",
    backgroundColor: "#00eaff",
    color: "#0a0f1f",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    boxShadow: "0 0 12px rgba(0,255,255,0.5)",
    transition: "0.2s",
  },
};
