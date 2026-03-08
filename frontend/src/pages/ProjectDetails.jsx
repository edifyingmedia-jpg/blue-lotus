/* -------------------------------------------------------------------------- */
/*                        PROJECT DETAILS — BLUE LOTUS                        */
/* -------------------------------------------------------------------------- */
/*  This file implements the full Blue Lotus Generator Engine with:            */
/*    - Two-panel Emergent-style layout                                        */
/*    - Unified scroll workspace                                               */
/*    - Full neon section headers                                              */
/*    - Minimal + Cinematic code generation toggle                             */
/*    - Full-stack bundle generation (React + Supabase + API + Auth + Routing) */
/*    - Blueprint → Preview → Code Generator → Code Output                     */
/*    - Founder override + protection layer                                    */
/*    - Tri-Neon cinematic UI                                                  */
/* -------------------------------------------------------------------------- */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ProjectDetails() {
  const { id } = useParams();

  /* ------------------------------------------------------------------------ */
  /*                               STATE HOOKS                                */
  /* ------------------------------------------------------------------------ */
  const [project, setProject] = useState(null);
  const [description, setDescription] = useState("");
  const [blueprint, setBlueprint] = useState(null);
  const [previewPage, setPreviewPage] = useState(null);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [codeStyle, setCodeStyle] = useState("minimal"); // minimal | cinematic
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState(null);

  /* ------------------------------------------------------------------------ */
  /*                         FETCH PROJECT FROM SUPABASE                       */
  /* ------------------------------------------------------------------------ */
  useEffect(() => {
    async function fetchProject() {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error(error);
      else {
        setProject(data);
        setDescription(data.description || "");
      }
    }
    fetchProject();
  }, [id]);

  /* ------------------------------------------------------------------------ */
  /*                         BLUEPRINT GENERATION ENGINE                       */
  /* ------------------------------------------------------------------------ */
  async function generateBlueprint() {
    setLoading(true);
    setWarning(null);

    try {
      const response = await fetch("/api/generate-blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      const result = await response.json();
      setBlueprint(result.blueprint);
      setPreviewPage(result.blueprint.pages?.[0]?.name || null);
    } catch (err) {
      console.error(err);
      setWarning("Blueprint generation failed.");
    }

    setLoading(false);
  }

  /* ------------------------------------------------------------------------ */
  /*                         FULL-STACK CODE GENERATION                        */
  /* ------------------------------------------------------------------------ */
  async function generateFullStackBundle() {
    if (!blueprint) {
      setWarning("Generate a blueprint first.");
      return;
    }

    setLoading(true);
    setWarning(null);

    try {
      const response = await fetch("/api/generate-app-bundle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blueprint, codeStyle }),
      });

      const result = await response.json();
      setGeneratedCode(result.bundle);

      // Save bundle to Supabase
      await supabase
        .from("projects")
        .update({ app_bundle: result.bundle })
        .eq("id", id);
    } catch (err) {
      console.error(err);
      setWarning("Code generation failed.");
    }

    setLoading(false);
  }

  /* ------------------------------------------------------------------------ */
  /*                              PREVIEW RENDERER                             */
  /* ------------------------------------------------------------------------ */
  function renderPreview() {
    if (!blueprint || !previewPage) return <p>No preview available.</p>;

    const page = blueprint.pages.find((p) => p.name === previewPage);
    if (!page) return <p>Page not found.</p>;

    return (
      <div style={styles.phoneFrame}>
        <div style={styles.phoneScreen}>
          <h3>{page.name}</h3>
          {page.elements?.map((el, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              <strong>{el.type}</strong>: {el.content || "(no content)"}
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /*                               LOADING STATE                               */
  /* ------------------------------------------------------------------------ */
  if (!project)
    return <p style={{ color: "white", padding: "40px" }}>Loading...</p>;

  /* ------------------------------------------------------------------------ */
  /*                               MAIN LAYOUT                                 */
  /* ------------------------------------------------------------------------ */
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>{project.name}</h1>

      {warning && (
        <div style={styles.warningBox}>
          <pre style={{ whiteSpace: "pre-wrap" }}>{warning}</pre>
        </div>
      )}

      <div style={styles.layout}>
        {/* ------------------------------------------------------------------ */}
        {/* LEFT PANEL — AI + DESCRIPTION                                      */}
        {/* ------------------------------------------------------------------ */}
        <div style={styles.leftPanel}>
          <h2 style={styles.panelTitle}>AI Description</h2>

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

        {/* ------------------------------------------------------------------ */}
        {/* RIGHT PANEL — UNIFIED WORKSPACE (BLUEPRINT → PREVIEW → CODE)       */}
        {/* ------------------------------------------------------------------ */}
        <div style={styles.rightPanel}>
          {/* ------------------------- BLUEPRINT SECTION --------------------- */}
          <h2 style={styles.sectionHeader}>Blueprint</h2>
          {!blueprint ? (
            <p style={{ opacity: 0.7 }}>No blueprint generated yet.</p>
          ) : (
            <pre style={styles.outputBox}>
              {JSON.stringify(blueprint, null, 2)}
            </pre>
          )}

          {/* --------------------------- PREVIEW SECTION ---------------------- */}
          <h2 style={styles.sectionHeader}>Preview</h2>
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

          {/* ----------------------- CODE GENERATOR SECTION ------------------- */}
          <h2 style={styles.sectionHeader}>Code Generator</h2>

          <label style={styles.toggleLabel}>
            Code Style:
            <select
              value={codeStyle}
              onChange={(e) => setCodeStyle(e.target.value)}
              style={styles.dropdown}
            >
              <option value="minimal">Minimal</option>
              <option value="cinematic">Cinematic</option>
            </select>
          </label>

          <button
            onClick={generateFullStackBundle}
            disabled={loading}
            style={styles.generateButton}
          >
            {loading ? "Generating..." : "Generate Full App Bundle"}
          </button>

          {/* ------------------------ GENERATED CODE SECTION ------------------ */}
          <h2 style={styles.sectionHeader}>Generated Code Output</h2>
          {!generatedCode ? (
            <p style={{ opacity: 0.7 }}>No code generated yet.</p>
          ) : (
            <pre style={styles.outputBox}>
              {JSON.stringify(generatedCode, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   STYLES                                   */
/* -------------------------------------------------------------------------- */
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

  layout: {
    display: "flex",
    gap: "30px",
  },

  leftPanel: {
    width: "35%",
    background: "#11182f",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(0, 238, 255, 0.2)",
    height: "fit-content",
  },

  rightPanel: {
    width: "65%",
    background: "#11182f",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(255, 0, 255, 0.2)",
    overflowY: "auto",
    maxHeight: "80vh",
  },

  panelTitle: {
    fontSize: "20px",
    marginBottom: "10px",
    textShadow: "0 0 8px #00eaff",
  },

  sectionHeader: {
    fontSize: "22px",
    marginTop: "30px",
    marginBottom: "10px",
    textShadow: "0 0 10px #ff00ff",
    borderBottom: "1px solid rgba(255, 0, 255, 0.4)",
    paddingBottom: "6px",
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

  toggleLabel: {
    display: "block",
    marginTop: "10px",
    marginBottom: "10px",
  },
};
