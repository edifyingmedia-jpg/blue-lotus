// frontend/src/main.jsx

/**
 * main.jsx
 * --------
 * Vite entry point.
 * Renders the Blue Lotus App into the DOM.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
