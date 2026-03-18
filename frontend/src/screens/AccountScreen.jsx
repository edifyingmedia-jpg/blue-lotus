// frontend/src/screens/AccountScreen.jsx

import React from "react";
import Container from "../components/Container";
import Text from "../components/Text";
import Button from "../components/Button";
import Spacer from "../components/Spacer";

/**
 * AccountScreen
 * ---------------------------------------------------------
 * A simple placeholder account screen.
 * This will later connect to user profile, billing, and identity settings.
 */

const AccountScreen = ({ navigation }) => {
  return (
    <Container>
      <Text size="1.4rem" weight={600}>
        Account
      </Text>

      <Text color="rgba(255,255,255,0.8)">
        Manage your account details and preferences.
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

export default AccountScreen;
