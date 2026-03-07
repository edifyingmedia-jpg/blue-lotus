import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setProjects([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) {
        setProjects(data || []);
      }

      setLoading(false);
    }

    loadProjects();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>My Projects</h1>
      <p style={styles.subtext}>Your cinematic creations.</p>

      {loading && <p style={styles.loading}>Loading projects...</p>}

      {!loading && projects.length === 0 && (
        <p style={styles.empty}>You have no projects yet.</p>
      )}

      <div style={styles.grid}>
        {projects.map((project) => (
          <div key={project.id} style={styles.card}>
            <h3 style={styles.cardTitle}>{project.name}</h3>
            <p style={styles.cardText}>
              Created: {new Date(project.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
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

  loading: {
    opacity: 0.8,
  },

  empty: {
    opacity: 0.7,
    fontSize: "16px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "25px",
    marginTop: "20px",
  },

  card: {
    backgroundColor: "#11182f",
    padding: "25px",
    borderRadius: "12px",
    border: "1px solid rgba(0,255,255,0.15)",
    boxShadow: "0 0 15px rgba(0,255,255,0.1)",
  },

  cardTitle: {
    fontSize: "20px",
    marginBottom: "10px",
    color: "#00eaff",
  },

  cardText: {
    opacity: 0.8,
  },
};
