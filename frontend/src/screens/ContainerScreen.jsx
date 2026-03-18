// frontend/src/screens/ContainerScreen.jsx

import React from "react";
import Container from "../components/Container";
import Text from "../components/Text";
import Button from "../components/Button";
import Spacer from "../components/Spacer";

/**
 * ContainerScreen
 * ---------------------------------------------------------
 * Demonstrates the Container layout component.
 * This corresponds to Container.json in your screens folder.
 */

const ContainerScreen = ({ navigation }) => {
  return (
    <Container>
      <Text size="1.6rem" weight={700}>
        Container Demo
      </Text>

      <Spacer size="1rem" />

      <Text>
        This entire screen is wrapped in your Container component,
        which provides padding, layout structure, and background styling.
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

export default ContainerScreen;
