// frontend/src/runtime/ErrorBoundary.js

import React from "react";

/**
 * ErrorBoundary
 * ---------------------------------------------------------
 * Catches runtime errors in the component tree and prevents
 * the entire builder or preview UI from crashing.
 *
 * It does NOT:
 *  - attempt to fix errors
 *  - swallow errors silently
 *  - mutate appDefinition or components
 */

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (this.props.onError) {
      this.props.onError({ error, info });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            padding: 16,
            boxSizing: "border-box",
            backgroundColor: "#1e293b",
            color: "#f1f5f9",
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontSize: 13,
            border: "1px solid #334155",
            borderRadius: 6,
          }}
        >
          <div>
            <strong>Component Error</strong>
            <div style={{ marginTop: 8, opacity: 0.8 }}>
              {this.state.error?.message || "An unexpected error occurred."}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
