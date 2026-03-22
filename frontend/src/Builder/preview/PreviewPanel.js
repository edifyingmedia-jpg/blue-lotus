// frontend/src/Builder/preview/PreviewPanel.js

import React, { useMemo } from "react";
import PropTypes from "prop-types";

import PreviewContainer from "./PreviewContainer";

/**
 * PreviewPanel
 *
 * This component integrates the Preview Engine into the Builder UI.
 * It is responsible for:
 *  - Layout inside the Builder's panel system
 *  - Passing appId + route into the PreviewContainer
 *  - Providing a clean visual boundary between editor and preview
 *  - Ensuring the preview remains isolated from editor interactions
 *
 * It does NOT:
 *  - Simulate preview behavior
 *  - Provide mock data
 *  - Modify the runtime tree
 *  - Invent UI or placeholders
 */
export function PreviewPanel({
  appId,
  initialRoute,
  mode = "preview",
  onEvent,
  padding = 0,
  background = "#0a0f1f",
  showChrome = true,
  chromeTitle,
  style,
}) {
  const panelStyle = useMemo(
    () => ({
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
      overflow: "hidden",
      backgroundColor: background,
      ...style,
    }),
    [background, style]
  );

  return (
    <div className="bl-preview-panel" style={panelStyle}>
      <PreviewContainer
        appId={appId}
        initialRoute={initialRoute}
        mode={mode}
        onEvent={onEvent}
        padding={padding}
        background={background}
        showChrome={showChrome}
        chromeTitle={chromeTitle}
      />
    </div>
  );
}

PreviewPanel.propTypes = {
  appId: PropTypes.string.isRequired,
  initialRoute: PropTypes.string,
  mode: PropTypes.oneOf(["preview", "live"]),
  onEvent: PropTypes.func,
  padding: PropTypes.number,
  background: PropTypes.string,
  showChrome: PropTypes.bool,
  chromeTitle: PropTypes.string,
  style: PropTypes.object,
};

export default PreviewPanel;
