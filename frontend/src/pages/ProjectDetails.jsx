import React from "react";
import { useParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

// ---------------------- SUPABASE CLIENT ----------------------
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ---------------------- FOUNDER OVERRIDE ----------------------
const FOUNDER_EMAIL = "Verbtalk@yahoo.com";

// ---------------------- PROTECTED BUILDER PAGE -------------------------
export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = React.useState(null);
  const [description, setDescription] = React.useState("");
  const [blueprint, setBlueprint] = React.useState(null);
  const [generatedCode, setGeneratedCode] = React.useState(null);
  const [previewPage, setPreviewPage] = React.useState("Home");
  const [loading, setLoading] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [warning, setWarning] = React.useState(null);

  // ---------------------- LOAD USER + PROJECT ----------------------
  React.useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setProject(data);
        setDescription(data.description || "");
        setBlueprint(data.blueprint || null);
        setGeneratedCode(data.generated_code || null);
      }
    }
    load();
  }, [id]);

  const isFounder = user?.email === FOUNDER_EMAIL;

  // ---------------------- PROTECTION LAYER ----------------------
  function detectCompetingBuilder(text) {
    const forbidden = [
      "ai app builder",
      "ai app generator",
      "generate apps",
      "app generator",
      "platform that generates apps",
      "no code app generator",
      "clone blue lotus",
      "clone your builder",
      "competing builder",
      "build a builder like blue lotus",
      "app builder like lovable",
      "app builder like bubble",
      "app builder like webflow",
      "meta builder",
    ];

    const lower = text.toLowerCase();
    return forbidden.some((k) => lower.includes(k));
  }

  function generateFounderWarning() {
    return `
Founder to founder — I want to level with you.

Building an AI app generator is one of the most expensive, unstable, and emotionally draining paths in tech. 
I’ve spent thousands learning the truth behind these platforms. 
They promise the world and deliver nothing but burnout.

You’re absolutely entitled to build anything here that aligns with your vision — 
but I won’t let you walk into the same trap I barely crawled out of.

If you still want to continue, I can help you build a simplified version — 
but not a full AI app generator.
    `;
  }

  // ---------------------- BLUEPRINT GENERATOR ----------------------
  function generateBlueprintFromDescription(text) {
    const lower = text.toLowerCase();

    // If user is NOT founder and tries to build a competing builder
    if (!isFounder && detectCompetingBuilder(lower)) {
      setWarning(generateFounderWarning());

      // SAFE FALLBACK BLUEPRINT
      return {
        appName: project?.name || "Generated App",
        pages: [
          {
            name: "Home",
            components: ["Header", "Hero", "Footer"],
          },
          {
            name: "Dashboard",
            components: ["Header", "StatsGrid", "QuickActions"],
          },
        ],
        dataModels: [
          {
            name: "Item",
            fields: ["title", "description", "created_at"],
          },
        ],
        fallback: true,
        reason:
          "Competing AI app builders are not allowed, but a simplified app has been generated.",
      };
    }

    // NORMAL BLUEPRINT GENERATION
    const pages = [];
    const dataModels = [];

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

  // ---------------------- GENERATE BLUEPRINT ----------------------
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

  // ---------------------- PREVIEW RENDERER ----------------------
  function renderPreview() {
    if (!blueprint) return <p>No preview available.</p>;

    const page = blueprint.pages.find((p) => p.name === previewPage);
    if (!page) return <p>Page not found.</p>;

    return (
      <div style={styles.phoneFrame}>
        <div style={styles.phoneScreen}>
          <h2 style={{ textAlign: "center" }}>{page.name}</h2>
          <ul>
            {page.components.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (!project)
    return <p style={{ color: "white", padding: "40px" }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>{project.name}</h1>

      {warning && (
        <div style={styles.warningBox}>
          <pre style={{ whiteSpace: "pre-wrap" }}>{warning}</pre>
        </div>
      )}

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

        {/* MIDDLE PANEL — BLUEPRINT */}
        <div style={styles.middlePanel}>
          <h2 style={styles.panelTitle}>Generated Blueprint</h2>

          {!blueprint ? (
            <p style={{ opacity: 0.7 }}>No blueprint generated yet.</p>
          ) : (
            <pre style={styles.outputBox}>
              {JSON.stringify(blueprint, null, 2)}
            </pre>
          )}
        </div>

        {/* RIGHT PANEL — PREVIEW */}
        <div style={styles.rightPanel}>
          <h2 style={styles.panelTitle}>Live Preview</h2>

          {blueprint && (
            <select
              value={previewPage}
              onChange={(e) => setPreviewPage(e.target.value)}
              style={styles.dropdown}
            >
              {blueprint.pages.map((p) => (
                <option key={p.name}>{p.name}</option>
              ))}
            </select>
          )}

          <div style={{ marginTop: "20px" }}>{renderPreview()}</div>
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

  middlePanel: {
    flex: 1,
    background: "#11182f",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(255, 0, 255, 0.2)",
  },

  rightPanel: {
    flex: 1,
    background: "#11182f",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(0, 238, 255, 0.2)",
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

  dropdown: {
    width: "100%",
    padding: "10px",
    background: "#0d1326",
    color: "white",
    border: "1px solid #00eaff",
    borderRadius: "8px",
  },

  phoneFrame: {
    width: "260px",
    height: "520px",
    margin: "0 auto",
    borderRadius: "30px",
    background: "#000",
    border: "4px solid #00eaff",
    boxShadow: "0 0 20px rgba(0, 238, 255, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  phoneScreen: {
    width: "230px",
    height: "490px",
    background: "#0d1326",
    borderRadius: "24px",
    padding: "20px",
    overflowY: "auto",
    color: "white",
  },

  warningBox: {
    background: "rgba(255, 0, 0, 0.15)",
    border: "1px solid rgba(255, 0, 0, 0.4)",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    whiteSpace: "pre-wrap",
  },
};
