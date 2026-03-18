// frontend/src/screens/TextScreen.jsx

import React from "react";
import Container from "../components/Container";
import Text from "../components/Text";
import Button from "../components/Button";
import Spacer from "../components/Spacer";

/**
 * TextScreen
 * ---------------------------------------------------------
 * Demonstrates text rendering and styling.
 * This corresponds to Text.json in your screens folder.
 */

const TextScreen = ({ navigation }) => {
  return (
    <Container>
      <Text size="1.6rem" weight={700}>
        Text Demo
      </Text>

      <Spacer size="1rem" />

      <Text>
        This is a standard text block using your custom Text component.
      </Text>

      <Spacer size="0.75rem" />

      <Text color="rgba(255,255,255,0.7)">
        This one uses a softer color for secondary information.
      </Text>

      <Spacer size="0.75rem" />

      <Text size="1.2rem" weight={600}>
        And this one is slightly larger and semi‑bold.
      </Text>

      <Spacer size="1.5rem" />

      <Button
        variant="secondary"
        text="Back"
        onClick={() => navigation.pop()}
      />
    </Container>
  );
};

export default TextScreen;
