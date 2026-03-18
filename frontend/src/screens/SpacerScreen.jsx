// frontend/src/screens/SpacerScreen.jsx

import React from "react";
import Container from "../components/Container";
import Text from "../components/Text";
import Spacer from "../components/Spacer";
import Button from "../components/Button";

/**
 * SpacerScreen
 * ---------------------------------------------------------
 * Demonstrates vertical spacing using your Spacer component.
 * This corresponds to Spacer.json in your screens folder.
 */

const SpacerScreen = ({ navigation }) => {
  return (
    <Container>
      <Text size="1.6rem" weight={700}>
        Spacer Demo
      </Text>

      <Spacer size="1rem" />

      <Text>
        Below is a 2rem spacer:
      </Text>

      <Spacer size="2rem" />

      <Text>
        And below is a 4rem spacer:
      </Text>

      <Spacer size="4rem" />

      <Button
        variant="secondary"
        text="Back"
        onClick={() => navigation.pop()}
      />
    </Container>
  );
};

export default SpacerScreen;
