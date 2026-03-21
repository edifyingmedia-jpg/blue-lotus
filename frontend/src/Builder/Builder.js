// frontend/src/Builder/Builder.js

/**
 * Builder
 * ---------------------------------------------------------
 * Main Builder container.
 * Wires state, actions, and layout together.
 */

import React from "react";
import { BuilderLayout } from "./Layout";
import { Canvas } from "./components/Canvas";
import { useBuilderState } from "./state";
import { selectScreen } from "./actions/screenActions";

export function Builder({ initialState }) {
  const { builderState, updateBuilderState } = useBuilderState(initialState);

  const handleSelectScreen = (index) => {
    selectScreen(updateBuilderState, index);
  };

  return (
    <BuilderLayout
      builderState={builderState}
      onSelectScreen={handleSelectScreen}
    >
      <Canvas builderState={builderState} />
    </BuilderLayout>
  );
}
