// --- TWIN Integration ---
import { useTWIN } from "../runtime/twin/useTWIN";

const BuilderSkeleton = () => {
  const { input, setInput, output, loading, sendMessage } = useTWIN();

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "rgba(5, 5, 15, 1)",
        color: "white",
        overflow: "hidden",
      }}
    >
      <NavBar />

      <div
        style={{
          display: "flex",
          flex: 1,
          width: "100%",
          height: "100%",
        }}
      >
        {/* Left Panel */}
        <div
          style={{
            width: "240px",
            background: "rgba(20, 20, 40, 0.9)",
            borderRight: "1px solid rgba(120, 120, 255, 0.25)",
            backdropFilter: "blur(10px)",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <div style={sectionTitle}>Navigation</div>
          <div style={navItem}>Screens</div>
          <div style={navItem}>Components</div>
          <div style={navItem}>Assets</div>
          <div style={navItem}>Data</div>
        </div>

        {/* Center Canvas */}
        <div
          style={{
            flex: 1,
            background: "rgba(10, 10, 25, 0.8)",
            borderRight: "1px solid rgba(120, 120, 255, 0.25)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.6)",
            fontSize: "18px",
          }}
        >
          Canvas Area (Your App Preview Will Render Here)
        </div>

        {/* Right Panel — TWIN Assistant */}
        <div
          style={{
            width: "320px",
            background: "rgba(20, 0, 40, 0.85)",
            borderLeft: "1px solid rgba(255, 0, 150, 0.3)",
            backdropFilter: "blur(10px)",
            padding: "20px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={sectionTitle}>TWIN Assistant</div>

          {/* Output Panel */}
          <div
            style={{
              flex: 1,
              background: "rgba(255, 0, 150, 0.05)",
              border: "1px solid rgba(255, 0, 150, 0.3)",
              borderRadius: "8px",
              padding: "12px",
              overflowY: "auto",
              color: "rgba(255,255,255,0.8)",
              whiteSpace: "pre-wrap",
            }}
          >
            {loading ? "TWIN is thinking..." : output || "TWIN output will appear here."}
          </div>

          {/* Textarea */}
          <textarea
            placeholder="Ask TWIN to generate screens, components, flows..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              width: "100%",
              height: "80px",
              borderRadius: "8px",
              border: "1px solid rgba(255, 0, 150, 0.3)",
              background: "rgba(255, 0, 150, 0.05)",
              color: "white",
              padding: "10px",
              resize: "none",
            }}
          />

          {/* Send Button */}
          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              padding: "10px",
              borderRadius: "8px",
              background:
                "linear-gradient(90deg, rgba(255,0,150,0.8), rgba(120,0,255,0.8))",
              border: "none",
              color: "white",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              boxShadow: "0 0 12px rgba(255,0,150,0.4)",
            }}
          >
            {loading ? "Sending..." : "Send to TWIN"}
          </button>
        </div>
      </div>
    </div>
  );
};
