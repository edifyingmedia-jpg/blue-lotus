import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loadScreen } from "../runtime/loadScreen";
import ScreenPage from "./ScreenPage";

/**
 * ScreenRoute
 * -----------
 * Dynamic route handler for URLs like:
 *   /screen/:name
 *
 * Loads the screen JSON using loadScreen()
 * and renders it through ScreenPage.
 */

export default function ScreenRoute() {
  const { name } = useParams();
  const [screen, setScreen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScreen() {
      setLoading(true);
      const loaded = await loadScreen(name);
      setScreen(loaded);
      setLoading(false);
    }

    fetchScreen();
  }, [name]);

  if (loading) {
    return (
      <div style={{ padding: 20, color: "#888" }}>
        Loading screen <strong>{name}</strong>...
      </div>
    );
  }

  if (!screen) {
    return (
      <div style={{ padding: 20, color: "red" }}>
        <strong>Screen not found:</strong> {name}
      </div>
    );
  }

  return <ScreenPage screen={screen} />;
}
