// frontend/src/pages/ProjectDetails.jsx

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import NeonLoader from "../components/NeonLoader";

const TABS = ["Preview", "Navigation", "Blueprint", "Bundle"];

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [screens, setScreens] = useState([]);
  const [navigation, setNavigation] = useState([]);
  const [blueprint, setBlueprint] = useState(null);
  const [bundle, setBundle] = useState(null);

  const [activeTab, setActiveTab] = useState("Preview");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);

  // Replace with your actual runtime URL pattern if needed
  const livePreviewUrl = useMemo(() => {
    if (!project) return null;
    return `${window.location.origin}/runtime/${project.id || id}`;
  }, [project, id]);

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 1) Fetch project
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("*")
          .eq("id", id)
          .single();

        if (projectError) throw projectError;
        setProject(projectData);

        // 2) Fetch screens
        const { data: screensData, error: screensError } = await supabase
          .from("screens")
          .select("*")
          .eq("project_id", id)
          .order("created_at", { ascending: true });

        if (screensError) throw screensError;
        setScreens(screensData || []);

        // 3) Fetch navigation
        const { data: navData, error: navError } = await supabase
          .from("navigation")
          .select("*")
          .eq("project_id", id)
          .order("order_index", { ascending: true });

        if (navError) throw navError;
        setNavigation(navData || []);

        // 4) Fetch blueprint (high‑level config)
        const { data: blueprintData, error: blueprintError } = await supabase
          .from("blueprints")
          .select("*")
          .eq("project_id", id)
          .single();

        if (blueprintError && blueprintError.code !== "PGRST116") {
          // ignore "no rows" but surface real errors
          throw blueprintError;
        }
        setBlueprint(blueprintData || { project_id: id, config: {} });

        // 5) Fetch bundle (full app definition)
        const { data: bundleData, error: bundleError } = await supabase
          .from("bundles")
          .select("*")
          .eq("project_id", id)
          .single();

        if (bundleError && bundleError.code !== "PGRST116") {
          throw bundleError;
        }
        setBundle(bundleData || { project_id: id, payload: {} });
      } catch (err) {
        console.error("Error loading project details:", err);
        setError(err.message || "Failed to load project.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id]);

  const handleBack = () => {
    navigate("/projects");
  };

  const handleOpenLiveInNewTab = () => {
    if (!livePreviewUrl) return;
    window.open(livePreviewUrl, "_blank", "noopener,noreferrer");
  };

  const primaryScreen = useMemo(() => {
    if (!screens || screens.length === 0) return null;
    const home = screens.find((s) => s.is_home);
    return home || screens[0];
  }, [screens]);

  const extractedNavigation = useMemo(() => {
    if (!navigation || navigation.length === 0) return [];
    return navigation.map((item) => ({
      id: item.id,
      label: item.label,
      target_screen_id: item.target_screen_id,
      group: item.group || "Primary",
      status: item.is_active ? "active" : "inactive",
    }));
  }, [navigation]);

  const extractedScreens = useMemo(() => {
    if (!screens || screens.length === 0) return [];
    return screens.map((screen) => ({
      id: screen.id,
      name: screen.name,
      type: screen.type || "screen",
      status: screen.status || "draft",
    }));
  }, [screens]);

  const pretty = (value) =>
    JSON.stringify(value ?? {}, null, 2)
      .replace(/\n/g, "\n")
      .trim();

  if (isLoading) {
    return (
      <div className="page-shell neon-bg">
        <NeonLoader label="Loading project…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell neon-bg text-center text-red-300">
        <div className="max-w-xl mx-auto mt-16">
          <h1 className="text-2xl font-semibold mb-4">Something went wrong</h1>
          <p className="mb-6 opacity-80">{error}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-md border border-pink-400 text-pink-200 hover:bg-pink-500/10 transition"
          >
            Back to projects
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="page-shell neon-bg text-center text-slate-200">
        <div className="max-w-xl mx-auto mt-16">
          <h1 className="text-2xl font-semibold mb-4">Project not found</h1>
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-md border border-cyan-400 text-cyan-200 hover:bg-cyan-500/10 transition"
          >
            Back to projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell neon-bg min-h-screen text-slate-100">
      {/* Header */}
      <header className="flex items-center justify-between px-8 pt-6 pb-4 border-b border-slate-800/70 bg-slate-950/60 backdrop-blur">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="px-3 py-1.5 rounded-full border border-slate-700 text-xs uppercase tracking-[0.18em] text-slate-300 hover:border-cyan-400 hover:text-cyan-200 transition"
          >
            Back
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold tracking-wide">
                {project.name || "Untitled Project"}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-[0.18em] bg-pink-500/10 text-pink-300 border border-pink-500/40">
                Builder Studio
              </span>
            </div>
            {project.description && (
              <p className="text-xs mt-1 text-slate-400 max-w-xl">
                {project.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLiveModalOpen(true)}
            className="px-3 py-1.5 rounded-full border border-pink-400 text-xs uppercase tracking-[0.18em] text-pink-200 hover:bg-pink-500/10 transition"
          >
            Live preview
          </button>
          <button
            onClick={handleOpenLiveInNewTab}
            disabled={!livePreviewUrl}
            className="px-3 py-1.5 rounded-full border border-cyan-400 text-xs uppercase tracking-[0.18em] text-cyan-200 hover:bg-cyan-500/10 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Open in new tab
          </button>
        </div>
      </header>

      {/* Two‑panel layout */}
      <div className="flex gap-6 px-8 py-6">
        {/* Left: Tabs + content */}
        <div className="flex-1 min-w-0">
          {/* Tabs */}
          <div className="flex gap-3 mb-4 border-b border-slate-800/70">
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-xs uppercase tracking-[0.18em] border-b-2 -mb-px transition ${
                    isActive
                      ? "border-pink-400 text-pink-200"
                      : "border-transparent text-slate-500 hover:text-cyan-200 hover:border-cyan-400/60"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 backdrop-blur-sm p-4 min-h-[320px]">
            {activeTab === "Preview" && (
              <PreviewTab project={project} primaryScreen={primaryScreen} />
            )}

            {activeTab === "Navigation" && (
              <NavigationTab
                navigation={extractedNavigation}
                screens={extractedScreens}
              />
            )}

            {activeTab === "Blueprint" && (
              <JsonTab
                title="Blueprint"
                subtitle="High‑level app definition used by the generation engine."
                data={blueprint}
              />
            )}

            {activeTab === "Bundle" && (
              <JsonTab
                title="Bundle"
                subtitle="Full app bundle used to generate real frontend + backend."
                data={bundle}
              />
            )}
          </div>
        </div>

        {/* Right: Meta panel */}
        <aside className="w-[320px] shrink-0 space-y-4">
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-4">
            <h2 className="text-xs uppercase tracking-[0.18em] text-slate-400 mb-3">
              Project status
            </h2>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
              <span className="text-xs text-cyan-200">Connected to backend</span>
            </div>
            <p className="text-xs text-slate-400">
              Screens:{" "}
              <span className="text-slate-100 font-medium">
                {screens.length}
              </span>
            </p>
            <p className="text-xs text-slate-400">
              Navigation items:{" "}
              <span className="text-slate-100 font-medium">
                {navigation.length}
              </span>
            </p>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-4">
            <h2 className="text-xs uppercase tracking-[0.18em] text-slate-400 mb-3">
              Extraction summary
            </h2>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>
                <span className="text-pink-300">Screens:</span>{" "}
                {extractedScreens.length}
              </li>
              <li>
                <span className="text-pink-300">Navigation entries:</span>{" "}
                {extractedNavigation.length}
              </li>
              <li>
                <span className="text-pink-300">Blueprint:</span>{" "}
                {blueprint ? "Loaded" : "Generated shell"}
              </li>
              <li>
                <span className="text-pink-300">Bundle:</span>{" "}
                {bundle ? "Loaded" : "Generated shell"}
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Live preview modal */}
      {isLiveModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-[90vw] max-w-5xl h-[80vh] rounded-2xl border border-slate-800 bg-slate-950/95 shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-pink-300">
                  Live preview
                </p>
                <p className="text-[11px] text-slate-400">
                  This is the real runtime view, powered by your backend.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenLiveInNewTab}
                  disabled={!livePreviewUrl}
                  className="px-3 py-1.5 rounded-full border border-cyan-400 text-[11px] uppercase tracking-[0.18em] text-cyan-200 hover:bg-cyan-500/10 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Open in new tab
                </button>
                <button
                  onClick={() => setIsLiveModalOpen(false)}
                  className="px-3 py-1.5 rounded-full border border-slate-700 text-[11px] uppercase tracking-[0.18em] text-slate-300 hover:bg-slate-800/80 transition"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-950">
              {livePreviewUrl ? (
                <iframe
                  src={livePreviewUrl}
                  title="Live preview"
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                  Live preview URL is not configured yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------- Tab components ---------- */

const PreviewTab = ({ project, primaryScreen }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-pink-300">
            Static preview
          </p>
          <p className="text-[11px] text-slate-400">
            A cinematic mockup of the primary screen. Live behavior runs in the
            preview modal or new tab.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <span>Runtime connected</span>
        </div>
      </div>

      <div className="flex-1 rounded-xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900/90 overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none opacity-60 mix-blend-screen">
          <div className="absolute -top-32 -left-24 w-72 h-72 bg-pink-500/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-40 -right-24 w-80 h-80 bg-cyan-500/20 blur-3xl rounded-full" />
        </div>

        <div className="relative h-full flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-950/80">
            <div>
              <p className="text-xs font-medium text-slate-100">
                {primaryScreen?.name || "Primary screen"}
              </p>
              <p className="text-[11px] text-slate-400">
                {project?.name || "Project"} •{" "}
                {primaryScreen ? "Screen preview" : "No screens yet"}
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="text-pink-300">Static</span>
              <span className="text-slate-600">/</span>
              <span className="text-cyan-300">Live in modal</span>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center px-6 py-4">
            {primaryScreen ? (
              <div className="w-full max-w-md aspect-[9/16] rounded-[1.75rem] border border-slate-700/80 bg-slate-950/90 shadow-[0_0_40px_rgba(15,23,42,0.9)] overflow-hidden relative">
                <div className="absolute inset-x-16 top-2 h-1.5 rounded-full bg-slate-800/90" />
                <div className="absolute inset-x-24 bottom-2 h-1 rounded-full bg-slate-800/90" />

                <div className="h-full flex flex-col pt-6 pb-4 px-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-pink-500 to-cyan-400 shadow-[0_0_18px_rgba(236,72,153,0.7)]" />
                      <div>
                        <p className="text-[11px] text-slate-300">
                          {project?.name || "Project"}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {primaryScreen?.type || "Screen"}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-[0.18em] bg-slate-900/90 border border-slate-700 text-slate-300">
                      Preview
                    </span>
                  </div>

                  <div className="flex-1 rounded-xl border border-slate-800/80 bg-slate-900/80 p-3 flex flex-col gap-2">
                    <div className="h-4 w-24 rounded-full bg-slate-700/80" />
                    <div className="h-3 w-40 rounded-full bg-slate-800/80" />
                    <div className="h-3 w-32 rounded-full bg-slate-800/60" />
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="h-16 rounded-lg bg-slate-900/90 border border-slate-800/80" />
                      <div className="h-16 rounded-lg bg-slate-900/90 border border-slate-800/80" />
                    </div>
                    <div className="mt-auto flex gap-2">
                      <div className="flex-1 h-8 rounded-full bg-gradient-to-r from-pink-500/70 to-cyan-400/70 shadow-[0_0_18px_rgba(236,72,153,0.7)]" />
                      <div className="w-8 h-8 rounded-full border border-slate-700 bg-slate-900/90" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-sm text-slate-400">
                No screens found for this project yet.
                <br />
                <span className="text-[11px] text-slate-500">
                  Once screens exist, this panel will show a cinematic static
                  preview.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NavigationTab = ({ navigation, screens }) => {
  const screenById = useMemo(() => {
    const map = {};
    (screens || []).forEach((s) => {
      map[s.id] = s;
    });
    return map;
  }, [screens]);

  const grouped = useMemo(() => {
    const groups = {};
    (navigation || []).forEach((item) => {
      const key = item.group || "Primary";
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  }, [navigation]);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-pink-300">
            Navigation map
          </p>
          <p className="text-[11px] text-slate-400">
            Clean, Emergent‑style list of navigation entries and their targets.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto space-y-4 pr-1">
        {Object.keys(grouped).length === 0 && (
          <p className="text-xs text-slate-500">
            No navigation entries found for this project yet.
          </p>
        )}

        {Object.entries(grouped).map(([group, items]) => (
          <div key={group} className="border border-slate-800/80 rounded-lg">
            <div className="px-3 py-2 border-b border-slate-800/80 bg-slate-950/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
                <p className="text-[11px] uppercase tracking-[0.18em] text-pink-200">
                  {group}
                </p>
              </div>
              <span className="text-[11px] text-slate-500">
                {items.length} item{items.length !== 1 ? "s" : ""}
              </span>
            </div>

            <ul className="divide-y divide-slate-800/80">
              {items.map((item) => {
                const target = screenById[item.target_screen_id];
                return (
                  <li
                    key={item.id}
                    className="px-3 py-2.5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full border border-slate-700 bg-slate-900/80">
                        <span className="text-cyan-300 text-[13px]">➜</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-slate-100 truncate">
                          {item.label || "Untitled link"}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {target
                            ? `Targets: ${target.name}`
                            : "No target screen"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span
                        className={`px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-[0.18em] ${
                          item.status === "active"
                            ? "border-cyan-400 text-cyan-200"
                            : "border-slate-700 text-slate-500"
                        }`}
                      >
                        {item.status || "inactive"}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

const JsonTab = ({ title, subtitle, data }) => {
  const prettyJson = useMemo(
    () => JSON.stringify(data ?? {}, null, 2),
    [data]
  );

  return (
    <div className="h-full flex flex-col">
      <div className="mb-3">
        <p className="text-xs uppercase tracking-[0.18em] text-pink-300">
          {title}
        </p>
        <p className="text-[11px] text-slate-400">{subtitle}</p>
      </div>

      <div className="flex-1 rounded-lg border border-slate-800 bg-slate-950/80 overflow-hidden">
        <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Emergent‑style pretty JSON
          </span>
          <span className="text-[11px] text-slate-500">
            Read‑only • Source of truth for generation engine
          </span>
        </div>
        <pre className="flex-1 overflow-auto text-[11px] leading-relaxed px-3 py-3 font-mono text-slate-200 bg-slate-950/90">
          {prettyJson}
        </pre>
      </div>
    </div>
  );
};

export default ProjectDetails;
