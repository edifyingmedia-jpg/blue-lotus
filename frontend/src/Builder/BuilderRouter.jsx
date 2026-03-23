import React, { useState } from "react";
import ScreenEditor from "./ScreenEditor";
import ComponentEditor from "./ComponentEditor";
import NavigationEditor from "./NavigationEditor";
import BuilderPreview from "./BuilderPreview";

export default function BuilderRouter() {
  const [activePanel, setActivePanel] = useState("screens");

  const renderPanel = () => {
    switch (activePanel) {
      case "screens":
        return <ScreenEditor />;
      case "components":
        return <ComponentEditor />;
      case "navigation":
        return <NavigationEditor />;
      case "preview":
        return <BuilderPreview />;
      default:
        return <div>Select a panel from the sidebar.</div>;
    }
  };

  // Listen for sidebar button clicks
  React.useEffect(() => {
    const handler = (e) => {
      const panel = e.target.getAttribute("data-panel");
      if (panel) setActivePanel(panel);
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div className="builder-router">
      {renderPanel()}
    </div>
  );
}
