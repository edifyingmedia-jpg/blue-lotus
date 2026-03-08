import React from "react";
import { createClient } from "@supabase/supabase-js";

// ---------------------- SUPABASE CLIENT ----------------------
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ---------------------- DASHBOARD PAGE -----------------------
export default function Dashboard() {
  const [projects, setProjects] = React.useState([]);

  React.useEffect(() => {
    async function loadProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select("*");

      if (error) {
        console.error("Supabase error:", error);
      } else {
        setProjects(data);
      }
    }

    loadProjects();
  }, []);

  return (
    <div className="page-fade" style={styles.container}>
      <h1 style={styles.heading} className="neon-hover">
        Dashboard
      </h1>

      <p style={styles.subtext}>Welcome to your Blue Lotus dashboard.</p>

      <div className="neon-card" style={styles.card}>
        <h3 style={styles.cardTitle}>Your Projects</h3>

        {projects.length === 0 ? (
          <p style={styles.cardText}>No projects yet.</p>
        ) : (
          projects.map((p) => (
            <p key={p.id} style={styles.cardText}>
              {p.name}
            </p>
          ))
        )}
      </div>
    </div>
  );
}

/* --------------------------- CINEMATIC TRI-NEON STYLES ---------------------------- */
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
};
