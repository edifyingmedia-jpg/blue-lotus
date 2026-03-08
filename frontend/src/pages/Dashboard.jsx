import React from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

// ---------------------- SUPABASE CLIENT ----------------------
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ---------------------- DASHBOARD PAGE -----------------------
export default function Dashboard() {
  const [projects, setProjects] = React.useState([]);
  const navigate = useNavigate();

  // Load projects on mount
  React.useEffect(() => {
    async function loadProjects() {
      const { data, error } = await supabase.from("projects").select("*");
      if (!error) setProjects(data || []);
    }
    loadProjects();
  }, []);

  // Create a new project
  async function createProject() {
    const { data, error } = await supabase
      .from("projects")
      .insert([{ name: "New Project" }])
      .select()
      .single();

    if (!error && data) {
      navigate(`/projects/${data.id}`);
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Dashboard</h1>
      <p style={styles.subtext}>Welcome to your Blue Lotus dashboard.</p>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Your Projects</h3>

        {projects.length === 0 ? (
          <p style={styles.cardText}>No projects yet.</p>
        ) : (
          projects.map((p) => (
            <p
              key={p.id}
              style={styles.projectItem}
              onClick={() => navigate(`/projects/${p.id}`)}
            >
              {p.name}
            </p>
          ))
        )}

        <button onClick={createProject} style={styles.button}>
          + Create Project
        </button>
      </div>
    </div>
  );
}

/* --------------------------- TRI-NEON STYLES ---------------------------- */
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
    textShadow: "0 0 10px #00eaff, 0 0 20px #8a2be2, 0 0 30px #ff00ff",
  },

  subtext: {
    fontSize: "18px",
    marginBottom: "30px",
    opacity: 0.8,
  },

  card: {
    padding: "20px",
    backgroundColor: "#11182f",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(0, 238, 255, 0.3)",
  },

  cardTitle: {
    fontSize: "24px",
    marginBottom: "10px",
    textShadow: "0 0 8px #00eaff",
  },

  cardText: {
    fontSize: "16px",
    opacity: 0.9,
    marginBottom: "8px",
  },

  projectItem: {
    padding: "10px 0",
    cursor: "pointer",
    borderBottom: "1px solid rgba(0,238,255,0.1)",
  },

  button: {
    marginTop: "20px",
    padding: "12px 20px",
    background: "rgba(0, 238, 255, 0.15)",
    border: "1px solid #00eaff",
    borderRadius: "8px",
    color: "#00eaff",
    cursor: "pointer",
    fontSize: "16px",
    textShadow: "0 0 8px #00eaff",
    boxShadow: "0 0 12px rgba(0, 238, 255, 0.4)",
  },
};
