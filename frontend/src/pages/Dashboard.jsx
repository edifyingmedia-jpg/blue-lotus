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
    <div
      style={{
        padding: "40px",
        color: "white",
        minHeight: "100vh",
        background: "black",
      }}
    >
      {/* ---------------------- HEADER ---------------------- */}
      <h1
        style={{
          fontSize: "32px",
          marginBottom: "20px",
          color: "#00eaff",
          textShadow: "0 0 12px rgba(0,238,255,0.8)",
        }}
      >
        Dashboard
      </h1>

      {/* ---------------------- CREATE BUTTON ---------------------- */}
      <button
        onClick={createProject}
        style={{
          padding: "12px 20px",
          background: "transparent",
          border: "1px solid #ff00ff",
          color: "#ff00ff",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "30px",
          textShadow: "0 0 8px rgba(255,0,255,0.7)",
          transition: "0.2s",
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "rgba(255,0,255,0.15)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "transparent";
        }}
      >
        + Create New Project
      </button>

      {/* ---------------------- PROJECT GRID ---------------------- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "24px",
        }}
      >
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => navigate(`/projects/${project.id}`)}
            style={{
              padding: "20px",
              borderRadius: "10px",
              background: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(0,238,255,0.3)",
              cursor: "pointer",
              transition: "0.25s",
              boxShadow: "0 0 12px rgba(0,238,255,0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 0 18px rgba(0,238,255,0.45)";
              e.currentTarget.style.border =
                "1px solid rgba(255,0,255,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.boxShadow =
                "0 0 12px rgba(0,238,255,0.15)";
              e.currentTarget.style.border =
                "1px solid rgba(0,238,255,0.3)";
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                marginBottom: "10px",
                color: "#00eaff",
                textShadow: "0 0 8px rgba(0,238,255,0.7)",
              }}
            >
              {project.name}
            </h2>

            <p
              style={{
                fontSize: "14px",
                opacity: 0.7,
                marginBottom: "10px",
              }}
            >
              {project.description || "No description provided."}
            </p>

            <p
              style={{
                fontSize: "12px",
                opacity: 0.5,
              }}
            >
              Created: {new Date(project.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
