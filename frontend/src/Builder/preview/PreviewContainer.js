// frontend/src/Builder/preview/PreviewContainer.js

import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";

import PreviewFrame from "./PreviewFrame";

/**
 * PreviewContainer
 *
 * This component is the top-level wrapper for the entire Preview Engine.
 * It is responsible for:
 *  - Integrating the preview into the Builder layout
 *  - Managing sizing, padding, and responsive behavior
 *  - Passing appId, route, and events into the PreviewFrame
 *  - Ensuring the preview stays visually isolated from editor panels
 *
 * It does NOT:
 *  - Invent UI
 *  - Simulate preview behavior
 *  - Modify the runtime tree
 *  - Provide mock data
 */
export function PreviewContainer({
  appId,
  initialRoute,
  mode = "preview",
  onEvent,
  padding = 0,
  background = "#000000",
  showChrome = true,
  chromeTitle,
}) {
  const handleEvent = useCallback(
    (event) => {
      if (typeof onEvent === "function") {
        onEvent(event);
      }
    },
    [onEvent]
  );

  const containerStyle = useMemo(
    () => ({
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
      padding,
      backgroundColor: background,
      overflow: "hidden",
    }),
    [padding, background]
  );

  return (
    <div className="bl-preview-container" style={containerStyle}>
      <PreviewFrame
        appId={appId}
        initialRoute={initialRoute}
        mode={mode}
        onEvent={handleEvent}
        showChrome={showChrome}
        chromeTitle={chromeTitle}
      />
    </div>
  );
}

PreviewContainer.propTypes = {
  appId: PropTypes.string.isRequired,
  initialRoute: PropTypes.string,
  mode: PropTypes.oneOf(["preview", "live"]),
  onEvent: PropTypes.func,
  padding: PropTypes.number,
  background: PropTypes.string,
  showChrome: PropTypes.bool,
  chromeTitle: PropTypes.string,
};

export default PreviewContainer;
