// frontend/src/screens/HomeScreen.jsx

import React from "react";
import Container from "../components/Container";
import Text from "../components/Text";
import Button from "../components/Button";
import Spacer from "../components/Spacer";

/**
 * HomeScreen
 * ---------------------------------------------------------
 * A simple starter screen for Blue Lotus.
 * This is used by the runtime test harness and editor preview.
 */

const HomeScreen = ({ navigation }) => {
  return (
    <Container>
      <Text size="1.4rem" weight={600}>
        Welcome to Blue Lotus
      </Text>

      <Text color="rgba(255,255,255,0.8)">
        Your runtime is working beautifully.
      </Text>

      <Spacer size="1.5rem" />

      <Button
        text="Go to Dashboard"
        onClick={() => navigation.push("Dashboard")}
      />

      <Spacer size="1rem" />

      <Button
        variant="secondary"
        text="Reset to Login"
        onClick={() => navigation.reset("Login")}
      />
    </Container>
  );
};

export default HomeScreen;
