import React from "react";
import { BuilderProvider } from "./BuilderContext";
import BuilderLayout from "./BuilderLayout";
import BuilderRouter from "./BuilderRouter";
import "./builder.css";

export default function BuilderApp() {
  return (
    <BuilderProvider>
      <div className="builder-app">
        <BuilderLayout>
          <BuilderRouter />
        </BuilderLayout>
      </div>
    </BuilderProvider>
  );
}
