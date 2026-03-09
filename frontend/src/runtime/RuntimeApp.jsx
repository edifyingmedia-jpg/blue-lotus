// frontend/src/runtime/RuntimeApp.jsx

import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import supabase from "../supabaseClient";
import ScreenRenderer from "./ScreenRenderer";

const RuntimeApp = ({ projectId }) => {
  const [bundle, setBundle] = useState(null);
  const [blueprint, setBlueprint] = useState(null);
  const [screens, setScreens] = useState([]);
  const [navigation, setNavigation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRuntime = async () => {
      setLoading(true);

      const { data: bundleData } = await supabase
        .from("bundles")
        .select("*")
        .eq("project_id", projectId)
        .single();

      const { data: blueprintData } = await supabase
        .from("blueprints")
        .select("*")
        .eq("project_id", projectId)
        .single();

      const { data: screensData } = await supabase
        .from("screens")
        .select("*")
        .eq("project_id", projectId);

      const { data: navData } = await supabase
        .from("navigation")
        .select("*")
        .eq("project_id", projectId)
        .order("order_index", { ascending: true });

      setBundle(bundleData || { payload: {} });
      setBlueprint(blueprintData || { config: {} });
      setScreens(screensData || []);
      setNavigation(navData || []);
      setLoading(false);
    };

    loadRuntime();
  }, [projectId]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-300">
        Loading app…
      </div>
    );
  }

  if (!screens.length) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-300">
        No screens found for this app.
      </div>
    );
  }

  const home = screens.find((s) => s.is_home) || screens[0];

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={home.path || `/${home.id}`} replace />}
        />

        {screens.map((screen) => (
          <Route
            key={screen.id}
            path={screen.path || `/${screen.id}`}
            element={
              <ScreenRenderer
                screen={screen}
                screens={screens}
                navigation={navigation}
                bundle={bundle}
                blueprint={blueprint}
              />
            }
          />
        ))}

        <Route
          path="*"
          element={
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              Screen not found.
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default RuntimeApp;
