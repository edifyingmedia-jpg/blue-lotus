// frontend/src/Builder/Builder.js

/**
 * Builder
 * ---------------------------------------------------------
 * Main Builder container.
 * Wraps the layout and renders the Canvas inside it.
 */

import React from "react";
import { BuilderLayout } from "./Layout";
import { Canvas } from "./components/Canvas";
import { useBuilderState } from "./state";

export function Builder({ initialState }) {
  const { builderState } = useBuilderState(initialState);

  return (
    <BuilderLayout builderState={builderState}>
      <Canvas builderState={builderState} />
    </BuilderLayout>
  );
}
