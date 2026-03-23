import React from "react";
import BuilderLayout from "./BuilderLayout";
import BuilderRouter from "./BuilderRouter";
import "./builder.css";

export default function BuilderApp() {
  return (
    <div className="builder-app">
      <BuilderLayout>
        <BuilderRouter />
      </BuilderLayout>
    </div>
  );
}
