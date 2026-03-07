import React from "react";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }

    loadUser();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Dashboard</h1>
      <p>Welcome to your Blue Lotus dashboard.</p>

      {user && (
        <p style={{ marginTop: "20px" }}>
          Logged in as: <strong>{user.email}</strong>
        </p>
      )}
    </div>
  );
}
