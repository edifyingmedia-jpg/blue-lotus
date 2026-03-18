// frontend/src/screens/DashboardScreen.jsx

import React from "react";
import Container from "../components/Container";
import Text from "../components/Text";
import Button from "../components/Button";
import Spacer from "../components/Spacer";

/**
 * DashboardScreen
 * ---------------------------------------------------------
 * A simple second screen for Blue Lotus.
 * Used for navigation testing and editor preview.
 */

const DashboardScreen = ({ navigation }) => {
  return (
    <Container>
      <Text size="1.4rem" weight={600}>
        Dashboard
      </Text>

      <Text color="rgba(255,255,255,0.8)">
        This is your second screen. Navigation is working beautifully.
      </Text>

      <Spacer size="1.5rem" />

      <Button
        text="Go to Projects"
        onClick={() => navigation.push("Projects")}
      />

      <Spacer size="1rem" />

      <Button
        variant="secondary"
        text="Back to Home"
        onClick={() => navigation.pop()}
      />
    </Container>
  );
};

export default DashboardScreen;
