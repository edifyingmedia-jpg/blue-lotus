import React from "react";
import { useParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

// ---------------------- SUPABASE CLIENT ----------------------
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ---------------------- BUILDER PAGE -------------------------
export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = React.useState(null);
  const [description, setDescription] = React.useState("");
  const [blueprint, setBlueprint] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  // Load project on mount
  React.useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setProject(data);
        setDescription(data.description || "");
        setBlueprint(data.blueprint || null);
      }
    }
    load();
  }, [id]);

  // ---------------------- BLUEPRINT GENERATOR ----------------------
  function generateBlueprintFromDescription(text) {
    // Basic NLP-ish parsing (deterministic)
    const lower = text.toLowerCase();

    const pages = [];
    const dataModels = [];

    // Detect common pages
    if (lower.includes("login") || lower.includes("auth")) {
      pages.push({
        name: "Login",
        components: ["Logo", "LoginForm", "Footer"],
      });
    }

    if (lower.includes("dashboard")) {
      pages.push({
        name: "Dashboard",
        components: ["Header", "StatsGrid", "QuickActions"],
      });
    }

    if (lower.includes("profile") || lower.includes("user")) {
      pages.push({
        name: "Profile",
        components: ["Header", "UserCard", "EditProfileForm"],
      });

      dataModels.push({
        name: "User",
        fields: ["name", "email", "avatar", "created_at"],
      });
    }

    if (lower.includes("tasks") || lower.includes("todo")) {
      pages.push({
        name: "Tasks",
        components: ["Header", "TaskList", "AddTaskButton"],
      });

      dataModels.push({
        name: "Task",
        fields: ["title", "completed", "created_at"],
      });
    }

    // Default fallback if no keywords detected
    if (pages.length === 0) {
      pages.push({
        name: "Home",
        components: ["Header", "Hero", "Footer"],
      });
    }

    return {
      appName: project?.name || "Generated App",
      pages,
      dataModels,
      generatedAt: new Date().toISOString(),
    };
  }

  // ---------------------- GENERATE + SAVE ----------------------
  async function generateBlueprint() {
    setLoading(true);

    const generated = generateBlueprintFromDescription(description);

    await supabase
      .from("projects")
      .update({
        description,
        blueprint: generated,
      })
      .eq("id", id);

    setBlueprint(generated);
    setLoading(false);
  }

  if (!project)
    return <p style={{ color: "white", padding: "40px" }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>{project.name}</h1>

      <div style={styles.studio}>
        {/* LEFT PANEL — DESCRIPTION */}
        <div style={styles.leftPanel}>
          <h2 style={styles.panelTitle}>App Description</h2>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the app your client wants to generate..."
            style={styles.textarea}
          />

          <button
            onClick={generateBlueprint}
            disabled={loading}
            style={styles.generateButton}
          >
            {loading ? "Generating..." : "Generate App Blueprint"}
          </button>
        </div>

        {/* RIGHT PANEL — BLUEPRINT OUTPUT */}
        <div style={styles.rightPanel}>
          <h2 style={styles.panelTitle}>Generated Blueprint</h2>

          {!blueprint ? (
            <p style={{ opacity: 0.7 }}>No blueprint generated yet.</p>
          ) : (
            <pre style={styles.outputBox}>
              {JSON.stringify(blueprint, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

/* --------------------------- TRI-NEON STUDIO STYLES ---------------------------- */
const styles = {
  container: {
    padding: "40px",
    color: "white",
    backgroundColor: "#0a0f1f",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
  },

  heading: {
    fontSize: "32px",
    marginBottom: "20px",
    textShadow: "0 0 10px #00eaff",
  },

  studio: {
    display: "flex",
    gap: "30px",
  },

  leftPanel: {
    flex: 1,
    background: "#11182f",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(0, 238, 255, 0.2)",
  },

  rightPanel: {
    flex: 1,
    background: "#11182f",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(255, 0, 255, 0.2)",
  },

  panelTitle: {
    fontSize: "20px",
    marginBottom: "10px",
    textShadow: "0 0 8px #00eaff",
  },

  textarea: {
    width: "100%",
    height: "200px",
    background: "#0d1326",
    color: "white",
    border: "1px solid #00eaff",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "14px",
    resize: "vertical",
    boxShadow: "0 0 10px rgba(0, 238, 255, 0.2)",
  },

  generateButton: {
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

  outputBox: {
    background: "#0d1326",
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid rgba(255, 0, 255, 0.3)",
    boxShadow: "0 0 12px rgba(255, 0, 255, 0.2)",
    whiteSpace: "pre-wrap",
    fontSize: "14px",
  },
};
