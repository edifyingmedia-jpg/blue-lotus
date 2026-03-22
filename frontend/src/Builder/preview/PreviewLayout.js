// frontend/src/Builder/preview/PreviewLayout.js

import React, { useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";

import PreviewToolbar from "./PreviewToolbar";
import PreviewPanel from "./PreviewPanel";

/**
 * PreviewLayout
 *
 * This component arranges the PreviewToolbar and PreviewPanel together.
 * It is the top-level Builder-side layout for the entire preview system.
 *
 * Responsibilities:
 *  - Manage chrome visibility
 *  - Trigger preview refresh events
 *  - Provide a clean, stable layout for the preview engine
 *
 * It does NOT:
 *  - Simulate preview behavior
 *  - Provide mock data
 *  - Modify the runtime tree
 */
export function PreviewLayout({
  appId,
  initialRoute,
  mode = "preview",
  onEvent,
  background = "#0a0f1f",
  padding = 0,
  style,
}) {
  const [chromeVisible, setChromeVisible] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const handleToggleChrome = useCallback(() => {
    setChromeVisible((v) => !v);
  }, []);

  const layoutStyle = useMemo(
    () => ({
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: background,
      boxSizing: "border-box",
      overflow: "hidden",
      ...style,
    }),
    [background, style]
  );

  return (
    <div className="bl-preview-layout" style={layoutStyle}>
      <PreviewToolbar
        onRefresh={handleRefresh}
        onToggleChrome={handleToggleChrome}
        chromeVisible={chromeVisible}
      />

      <div style={{ flex: 1, overflow: "hidden" }}>
        <PreviewPanel
          key={refreshKey}
          appId={appId}
          initialRoute={initialRoute}
          mode={mode}
          onEvent={onEvent}
          padding={padding}
          background={background}
          showChrome={chromeVisible}
          chromeTitle={appId ? `Preview · ${appId}` : "Preview"}
        />
      </div>
    </div>
  );
}

PreviewLayout.propTypes = {
  appId: PropTypes.string.isRequired,
  initialRoute: PropTypes.string,
  mode: PropTypes.oneOf(["preview", "live"]),
  onEvent: PropTypes.func,
  background: PropTypes.string,
  padding: PropTypes.number,
  style: PropTypes.object,
};

export default PreviewLayout;
