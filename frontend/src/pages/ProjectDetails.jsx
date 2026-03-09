/* -------------------------------------------------------------------------- */
/* PROJECT DETAILS — BLUE LOTUS (CINEMATIC TWO-PANEL BUILDER STUDIO)          */
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
/* NEON LOADER COMPONENT                                                      */
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

export default function ProjectDetails() {
  const { id } = useParams();

  /* ---------------------------------------------------------------------- */
  /* STATE                                                                  */
  /* ---------------------------------------------------------------------- */
  const [project, setProject] = useState(null);
  const [description, setDescription] = useState("");
  const [blueprint, setBlueprint] = useState(null);
  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------------------------------------------------------------- */
  /* LOAD PROJECT                                                           */
  /* ---------------------------------------------------------------------- */
  useEffect(() => {
    async function loadProject() {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setProject(data);
        setDescription(data.description || "");
        setBlueprint(data.blueprint || null);
        setBundle(data.app_bundle || null);
      }
    }
    loadProject();
  }, [id]);

  /* ---------------------------------------------------------------------- */
  /* GENERATE BLUEPRINT                                                     */
  /* ---------------------------------------------------------------------- */
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

  /* ---------------------------------------------------------------------- */
  /* GENERATE APP BUNDLE                                                    */
  /* ---------------------------------------------------------------------- */
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

  /* ---------------------------------------------------------------------- */
  /* UI — CINEMATIC TWO-PANEL LAYOUT                                        */
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
      {/* GLOBAL ANIMATION STYLE */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.4; transform: scale(0.98); }
            50% { opacity: 1; transform: scale(1); }
            100% { opacity: 0.4; transform: scale(0.98); }
          }
        `}
      </style>

      {/* ------------------------------------------------------------------ */}
      {/* LEFT PANEL — AI ACTIONS                                           */}
      {/* ------------------------------------------------------------------ */}
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

        {/* DESCRIPTION INPUT */}
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

        {/* GENERATE BLUEPRINT */}
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
            transition: "0.2s",
          }}
        >
          Generate Blueprint
        </button>

        {/* GENERATE BUNDLE */}
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
            textShadow: "0 0 8px rgba(255,0,255,0.7)",
            transition: "0.2s",
            opacity: blueprint ? 1 : 0.4,
          }}
        >
          Generate App Bundle
        </button>

        {/* NEON LOADER */}
        {loading && (
          <NeonLoader mode={blueprint ? "bundle" : "blueprint"} />
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* RIGHT PANEL — MASSIVE WORKSPACE                                   */}
      {/* ------------------------------------------------------------------ */}
      <div
        style={{
          flex: 1,
          padding: "40px",
          overflowY: "scroll",
        }}
      >
        <h2
          style={{
            fontSize: "26px",
            marginBottom: "20px",
            color: "#ff00ff",
            textShadow: "0 0 12px rgba(255,0,255,0.7)",
          }}
        >
          Workspace
        </h2>

        {/* BLUEPRINT VIEW */}
        {blueprint && (
          <div
            style={{
              marginBottom: "40px",
              padding: "20px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(0,238,255,0.3)",
              borderRadius: "8px",
            }}
          >
            <h3
              style={{
                color: "#00eaff",
                marginBottom: "10px",
                textShadow: "0 0 8px rgba(0,238,255,0.7)",
              }}
            >
              Blueprint
            </h3>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                fontSize: "13px",
                opacity: 0.9,
              }}
            >
              {JSON.stringify(blueprint, null, 2)}
            </pre>
          </div>
        )}

        {/* BUNDLE VIEW */}
        {bundle && (
          <div
            style={{
              padding: "20px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,0,255,0.3)",
              borderRadius: "8px",
            }}
          >
            <h3
              style={{
                color: "#ff00ff",
                marginBottom: "10px",
                textShadow: "0 0 8px rgba(255,0,255,0.7)",
              }}
            >
              App Bundle
            </h3>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                fontSize: "13px",
                opacity: 0.9,
              }}
            >
              {JSON.stringify(bundle, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
