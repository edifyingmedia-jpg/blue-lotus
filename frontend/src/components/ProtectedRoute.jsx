import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getUser();

      if (!data?.user) {
        navigate("/login");
      } else {
        setAuthenticated(true);
      }

      setLoading(false);
    }

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <h1 style={styles.loadingText}>Checking authentication...</h1>
      </div>
    );
  }

  return authenticated ? children : null;
}

const styles = {
  loadingContainer: {
    backgroundColor: "#0a0f1f",
    color: "white",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Inter, sans-serif",
  },
  loadingText: {
    fontSize: "24px",
    color: "#00eaff",
    textShadow: "0 0 10px rgba(0,255,255,0.5)",
  },
};
