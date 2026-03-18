// frontend/src/screens/SettingsScreen.jsx

import React from "react";
import Container from "../components/Container";
import Text from "../components/Text";
import Button from "../components/Button";
import Spacer from "../components/Spacer";

/**
 * SettingsScreen
 * ---------------------------------------------------------
 * A simple placeholder settings screen.
 * This will later connect to account, theme, and editor preferences.
 */

const SettingsScreen = ({ navigation }) => {
  return (
    <Container>
      <Text size="1.4rem" weight={600}>
        Settings
      </Text>

      <Text color="rgba(255,255,255,0.8)">
        Customize your Blue Lotus experience.
      </Text>

      <Spacer size="1.5rem" />

      <Button
        text="Change Email"
        onClick={() => navigation.push("ChangeEmail")}
      />

      <Spacer size="1rem" />

      <Button
        text="Change Password"
        onClick={() => navigation.push("ChangePassword")}
      />

      <Spacer size="1rem" />

      <Button
        variant="secondary"
        text="Back"
        onClick={() => navigation.pop()}
      />
    </Container>
  );
};

export default SettingsScreen;
