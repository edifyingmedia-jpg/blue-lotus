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
import { addScreen } from "./actions/addScreen";

export function Builder({ initialState }) {
  const { builderState, updateBuilderState } = useBuilderState(initialState);

  const handleSelectScreen = (index) => {
    selectScreen(updateBuilderState, index);
  };

  const handleAddScreen = () => {
    addScreen(updateBuilderState);
  };

  return (
    <BuilderLayout
      builderState={builderState}
      onSelectScreen={handleSelectScreen}
      onAddScreen={handleAddScreen}
    >
      <Canvas builderState={builderState} />
    </BuilderLayout>
  );
}
