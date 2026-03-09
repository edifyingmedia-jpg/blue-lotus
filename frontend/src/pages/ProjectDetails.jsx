/* -------------------------------------------------------------------------- */
/* PROJECT DETAILS — BLUE LOTUS (CINEMATIC BUILDER STUDIO + PREVIEW MODE)     */
/* -------------------------------------------------------------------------- */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

/* -------------------------------------------------------------------------- */
/* SUPABASE CLIENT                                                            */
/* -------------------------------------------------------------------------- */
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

/* -------------------------------------------------------------------------- */
/* NEON LOADER                                                                */
/* -------------------------------------------------------------------------- */
function NeonLoader({ mode }) {
  const color = mode === "blueprint" ? "#00eaff" : "#ff00ff";

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "14px 18px",
        borderRadius: "8px",
        border: `1px solid ${color}`,
        color,
        textShadow: `0 0 10px ${color}`,
        boxShadow: `0 0 18px ${color}55`,
        animation: "pulse 1.4s ease-in-out infinite",
        width: "fit-content",
      }}
    >
      {mode === "blueprint"
        ? "Generating Blueprint…"
        : "Generating App Bundle…"}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* STATUS BADGE                                                               */
/* -------------------------------------------------------------------------- */
function StatusBadge({ label, status, color }) {
  const glow = color === "cyan" ? "#00eaff" : "#ff00ff";

  const text =
    status === "ready"
      ? "Ready"
      : status === "generating"
      ? "Generating…"
      : "Not Ready";

  return (
    <div
      style={{
        padding: "6px 10px",
        borderRadius: "6px",
        border: `1px solid ${glow}`,
        color: glow,
        fontSize: "12px",
        marginBottom: "10px",
        width: "fit-content",
        textShadow: `0 0 8px ${glow}`,
        opacity: status === "not_ready" ? 0.5 : 1,
        animation:
          status === "generating"
            ? "pulse 1.4s ease-in-out infinite"
            : "none",
      }}
    >
      {label}: {text}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* UNIVERSAL SCREEN EXTRACTOR                                                 */
/* -------------------------------------------------------------------------- */
function extractScreens(bundle) {
  if (!bundle) return [];

  // Case 1: bundle.screens = { Home: {...}, Login: {...} }
  if (bundle.screens && typeof bundle.screens === "object") {
    return Object.keys(bundle.screens).map((name) => ({
      name,
      data: bundle.screens[name],
    }));
  }

  // Case 2: bundle.pages = [ { name, components }, ... ]
  if (Array.isArray(bundle.pages)) {
    return bundle.pages.map((p) => ({
      name: p.name || "Untitled",
      data: p,
    }));
  }

  // Case 3: bundle.app.screens
  if (bundle.app?.screens) {
    return Object.keys(bundle.app.screens).map((name) => ({
      name,
      data: bundle.app.screens[name],
    }));
  }

  // Case 4: bundle.routes (fallback)
  if (Array.isArray(bundle.routes)) {
    return bundle.routes.map((r, i) => ({
      name: r.name || `Route ${i + 1}`,
      data: r,
    }));
  }

  // Fallback: treat entire bundle as one screen
  return [
    {
      name: "Preview",
      data: bundle,
    },
  ];
}

/* -------------------------------------------------------------------------- */
/* SIMPLE VISUAL PREVIEW RENDERER                                             */
/* -------------------------------------------------------------------------- */
function ScreenPreview({ screen }) {
  if (!screen) {
    return (
      <div style={{ opacity: 0.6 }}>Select a screen to preview.</div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "8px",
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <h3
        style={{
          color: "#00eaff",
          marginBottom: "10px",
          textShadow: "0 0 8px rgba(0,238,255,0.7)",
        }}
      >
        {screen.name}
      </h3>

      <pre
        style={{
          whiteSpace: "pre-wrap",
          fontSize: "13px",
          opacity: 0.9,
        }}
      >
        {JSON.stringify(screen.data, null, 2)}
      </pre>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT                                                             */
/* -------------------------------------------------------------------------- */
export default function ProjectDetails() {
  const { id } = useParams();

  /* STATE */
  const [project, setProject] = useState(null);
  const [description, setDescription] = useState("");
  const [blueprint, setBlueprint] = useState(null);
  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(false);

  /* TABS */
  const [activeTab, setActiveTab] = useState("preview");
  const [activeScreen, setActiveScreen] = useState(null);

  /* STATUS LOGIC */
  const blueprintStatus = loading && !blueprint
    ? "generating"
    : blueprint
    ? "ready"
    : "not_ready";

  const bundleStatus = loading && blueprint && !bundle
    ? "generating"
    : bundle
    ? "ready"
    : "not_ready";

  /* LOAD PROJECT */
  useEffect(() => {
    async function loadProject() {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setProject(data);
        setDescription(data.description || "");
        setBlueprint(data.blueprint || null);
        setBundle(data.app_bundle || null);
      }
    }
    loadProject();
  }, [id]);

  /* GENERATE BLUEPRINT */
  async function generateBlueprint() {
    setLoading(true);

    const res = await fetch("/api/generate-blueprint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    });

    const json = await res.json();
    setLoading(false);

    if (json.blueprint) {
      setBlueprint(json.blueprint);

      await supabase
        .from("projects")
        .update({ blueprint: json.blueprint })
        .eq("id", id);
    }
  }

  /* GENERATE BUNDLE */
  async function generateBundle() {
    if (!blueprint) return;

    setLoading(true);

    const res = await fetch("/api/generate-app-bundle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blueprint, projectId: id }),
    });

    const json = await res.json();
    setLoading(false);

    if (json.bundle) {
      setBundle(json.bundle);

      await supabase
        .from("projects")
        .update({ app_bundle: json.bundle })
        .eq("id", id);
    }
  }

  if (!project) {
    return (
      <div style={{ padding: 40, color: "white" }}>
        Loading project…
      </div>
    );
  }

  /* EXTRACT SCREENS FOR PREVIEW */
  const screens = extractScreens(bundle);

  /* ---------------------------------------------------------------------- */
  /* UI                                                                     */
  /* ---------------------------------------------------------------------- */
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "black",
        color: "white",
      }}
    >
      {/* GLOBAL ANIMATION */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.4; transform: scale(0.98); }
            50% { opacity: 1; transform: scale(1); }
            100% { opacity: 0.4; transform: scale(0.98); }
          }
        `}
      </style>

      {/* LEFT PANEL */}
      <div
        style={{
          width: "320px",
          padding: "30px",
          borderRight: "1px solid rgba(0,238,255,0.25)",
          background: "rgba(0,0,0,0.6)",
          boxShadow: "0 0 20px rgba(0,238,255,0.15)",
        }}
      >
        <h2
          style={{
            fontSize: "22px",
            marginBottom: "20px",
            color: "#00eaff",
            textShadow: "0 0 10px rgba(0,238,255,0.7)",
          }}
        >
          {project.name}
        </h2>

        {/* STATUS */}
        <StatusBadge label="Blueprint" status={blueprintStatus} color="cyan" />
        <StatusBadge label="Bundle" status={bundleStatus} color="magenta" />

        {/* DESCRIPTION */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your app…"
          style={{
            width: "100%",
            height: "120px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(0,238,255,0.3)",
            color: "white",
            padding: "10px",
            borderRadius: "6px",
            marginBottom: "20px",
          }}
        />

        {/* BUTTONS */}
        <button
          onClick={generateBlueprint}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
            background: "transparent",
            border: "1px solid #00eaff",
            color: "#00eaff",
            borderRadius: "6px",
            cursor: "pointer",
            textShadow: "0 0 8px rgba(0,238,255,0.7)",
          }}
        >
          Generate Blueprint
        </button>

        <button
          onClick={generateBundle}
          disabled={loading || !blueprint}
          style={{
            width: "100%",
            padding: "12px",
            background: "transparent",
            border: "1px solid #ff00ff",
            color: "#ff00ff",
            borderRadius: "6px",
            cursor: blueprint ? "pointer" : "not-allowed",
            opacity: blueprint ? 1 : 0.4,
            textShadow: "0 0 8px rgba(255,0,255,0.7)",
          }}
        >
          Generate App Bundle
        </button>

        {loading && (
          <NeonLoader mode={blueprint ? "bundle" : "blueprint"} />
        )}
      </div>

      {/* RIGHT PANEL */}
      <div
        style={{
          flex: 1,
          padding: "40px",
          overflowY: "scroll",
        }}
      >
        {/* TABS */}
        <div
          style={{
            display: "flex",
            gap: "30px",
            marginBottom: "20px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            paddingBottom: "10px",
          }}
        >
          {["preview", "blueprint", "bundle"].map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                cursor: "pointer",
                paddingBottom: "6px",
                borderBottom:
                  activeTab === tab
                    ? "2px solid #ff00ff"
                    : "2px solid transparent",
                color: activeTab === tab ? "#ff00ff" : "white",
                textShadow:
                  activeTab === tab
                    ? "0 0 8px rgba(255,0,255,0.7)"
                    : "none",
                transition: "0.2s",
              }}
            >
              {tab.toUpperCase()}
            </div>
          ))}
        </div>

        {/* TAB CONTENT */}
        {activeTab === "preview" && (
          <div>
            {/* SCREEN LIST */}
            <div style={{ marginBottom: "20px" }}>
              {screens.map((s) => (
                <div
                  key={s.name}
                  onClick={() => setActiveScreen(s)}
                  style={{
                    padding: "8px 12px",
                    marginBottom: "6px",
                    borderRadius: "6px",
                    border:
                      activeScreen?.name === s.name
                        ? "1px solid #ff00ff"
                        : "1px solid rgba(255,255,255,0.1)",
                    cursor: "pointer",
                    color:
                      activeScreen?.name === s.name
                        ? "#ff00ff"
                        : "white",
                    textShadow:
                      activeScreen?.name === s.name
                        ? "0 0 8px rgba(255,0,255,0.7)"
                        : "none",
                  }}
                >
                  {s.name}
                </div>
              ))}
            </div>

            {/* SCREEN PREVIEW */}
            <ScreenPreview screen={activeScreen} />
          </div>
        )}

        {activeTab === "blueprint" && (
          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontSize: "13px",
              opacity: 0.9,
            }}
          >
            {JSON.stringify(blueprint, null, 2)}
          </pre>
        )}

        {activeTab === "bundle" && (
          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontSize: "13px",
              opacity: 0.9,
            }}
          >
            {JSON.stringify(bundle, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
