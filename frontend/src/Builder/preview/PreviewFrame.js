// frontend/src/Builder/preview/PreviewFrame.js

import React, { useMemo } from "react";
import PropTypes from "prop-types";

import PreviewLoader from "./PreviewLoader";

/**
 * PreviewFrame
 *
 * This component is the visual and logical boundary between:
 *  - The Builder UI (editor, panels, controls)
 *  - The runtime preview (PreviewLoader → LivePreview → runtime tree)
 *
 * It:
 *  - Hosts the preview in an isolated frame-like container
 *  - Manages sizing and layout
 *  - Never mocks, simulates, or fakes the preview
 *  - Only renders what PreviewLoader and LivePreview provide
 */
export function PreviewFrame({
  appId,
  initialRoute,
  mode = "preview",
  onEvent,
  background = "#050816",
  borderColor = "#1f2933",
  borderRadius = 12,
  showChrome = true,
  chromeTitle,
}) {
  const title = useMemo(() => {
    if (chromeTitle) return chromeTitle;
    if (!appId) return "Preview";
    return `Preview · ${appId}`;
  }, [chromeTitle, appId]);

  return (
    <div
      className="bl-preview-frame"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        backgroundColor: background,
        borderRadius,
        border: `1px solid ${borderColor}`,
        overflow: "hidden",
      }}
    >
      {showChrome && (
        <div
          className="bl-preview-frame-chrome"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "6px 10px",
            boxSizing: "border-box",
            background:
              "linear-gradient(90deg, rgba(15,23,42,0.98), rgba(15,23,42,0.92))",
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 6,
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "999px",
                backgroundColor: "#f9703e",
              }}
            />
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "999px",
                backgroundColor: "#f7c948",
              }}
            />
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "999px",
                backgroundColor: "#3ebd93",
              }}
            />
          </div>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: 11,
              color: "#cbd2d9",
              fontFamily:
                "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              padding: "0 8px",
            }}
          >
            {title}
          </div>
          <div style={{ width: 40 }} />
        </div>
      )}

      <div
        className="bl-preview-frame-body"
        style={{
          position: "relative",
          flex: 1,
          backgroundColor: "#020617",
        }}
      >
        <div
          className="bl-preview-frame-viewport"
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
          }}
        >
          <PreviewLoader
            appId={appId}
            initialRoute={initialRoute}
            mode={mode}
            onEvent={onEvent}
          />
        </div>
      </div>
    </div>
  );
}

PreviewFrame.propTypes = {
  appId: PropTypes.string.isRequired,
  initialRoute: PropTypes.string,
  mode: PropTypes.oneOf(["preview", "live"]),
  onEvent: PropTypes.func,
  background: PropTypes.string,
  borderColor: PropTypes.string,
  borderRadius: PropTypes.number,
  showChrome: PropTypes.bool,
  chromeTitle: PropTypes.string,
};

export default PreviewFrame;
