import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";

import RuntimeApp from "./RuntimeApp.jsx";
import appDefinition from "./app.json";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RuntimeApp appDefinition={appDefinition} />);
