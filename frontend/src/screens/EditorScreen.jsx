// frontend/src/screens/EditorScreen.jsx

import React from "react";
import Container from "../components/Container";
import Text from "../components/Text";
import Button from "../components/Button";
import Spacer from "../components/Spacer";

/**
 * EditorScreen
 * ---------------------------------------------------------
 * Placeholder for the Blue Lotus editor.
 * This will later load the real project editor UI.
 */

const EditorScreen = ({ navigation }) => {
  return (
    <Container>
      <Text size="1.4rem" weight={600}>
        Editor
      </Text>

      <Text color="rgba(255,255,255,0.8)">
        The Blue Lotus editor will appear here.
      </Text>

      <Spacer size="1.5rem" />

      <Button
        text="Back to Dashboard"
        onClick={() => navigation.reset("Dashboard")}
      />
    </Container>
  );
};

export default EditorScreen;
