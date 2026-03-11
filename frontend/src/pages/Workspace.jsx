import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Workspace() {
  const location = useLocation();
  const description = location.state?.appDescription || "";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Later: call backend to generate initial app structure
    // For now: simulate loading the builder environment
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={styles.container}>
      {loading ? (
        <h2 style={styles.loading}>Preparing your workspace...</h2>
      ) : (
        <>
          <h1 style={styles.title}>Workspace</h1>
          <p style={styles.subtitle}>
            App description: <strong>{description}</strong>
          </p>

          <div style={styles.builderBox}>
            <p>Your builder UI will load here.</p>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "60px auto",
    padding: "20px",
  },
  loading: {
    fontSize: "22px",
    textAlign: "center",
  },
  title: {
    fontSize: "32px",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "16px",
    marginBottom: "20px",
  },
  builderBox: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "20px",
    minHeight: "300px",
  },
};
