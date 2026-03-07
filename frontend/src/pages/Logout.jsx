import React, { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    async function signOut() {
      await supabase.auth.signOut();
      navigate("/dashboard"); // or redirect to login if you have one
    }

    signOut();
  }, [navigate]);

  return (
    <div style={styles.container}>
      <h1 style={styles.text}>Logging you out...</h1>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#0a0f1f",
    color: "white",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Inter, sans-serif",
  },
  text: {
    fontSize: "24px",
    color: "#00eaff",
    textShadow: "0 0 10px rgba(0,255,255,0.5)",
  },
};
