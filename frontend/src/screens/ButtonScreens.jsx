// frontend/src/screens/ButtonScreen.jsx

import React from "react";
import Container from "../components/Container";
import Text from "../components/Text";
import Button from "../components/Button";
import Spacer from "../components/Spacer";

/**
 * ButtonScreen
 * ---------------------------------------------------------
 * Demonstrates button variants and interactions.
 * This corresponds to Button.json in your screens folder.
 */

const ButtonScreen = ({ navigation }) => {
  return (
    <Container>
      <Text size="1.6rem" weight={700}>
        Button Demo
      </Text>

      <Spacer size="1.25rem" />

      <Button
        text="Primary Button"
        onClick={() => {}}
      />

      <Spacer size="1rem" />

      <Button
        variant="secondary"
        text="Secondary Button"
        onClick={() => {}}
      />

      <Spacer size="1rem" />

      <Button
        variant="danger"
        text="Danger Button"
        onClick={() => {}}
      />

      <Spacer size="1.5rem" />

      <Button
        variant="secondary"
        text="Back"
        onClick={() => navigation.pop()}
      />
    </Container>
  );
};

export default ButtonScreen;
