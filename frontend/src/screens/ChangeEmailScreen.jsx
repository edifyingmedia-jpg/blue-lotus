// frontend/src/screens/ChangeEmailScreen.jsx

import React, { useState } from "react";
import Container from "../components/Container";
import Text from "../components/Text";
import Input from "../components/Input";
import Button from "../components/Button";
import Spacer from "../components/Spacer";

/**
 * ChangeEmailScreen
 * ---------------------------------------------------------
 * A simple placeholder screen for updating the user's email.
 * This will later connect to authentication + backend logic.
 */

const ChangeEmailScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");

  return (
    <Container>
      <Text size="1.4rem" weight={600}>
        Change Email
      </Text>

      <Text color="rgba(255,255,255,0.8)">
        Enter your new email address below.
      </Text>

      <Spacer size="1.5rem" />

      <Input
        placeholder="New email"
        value={email}
        onChange={setEmail}
      />

      <Spacer size="1.5rem" />

      <Button
        text="Save Email"
        onClick={() => {
          // Placeholder until backend is connected
          navigation.pop();
        }}
      />

      <Spacer size="1rem" />

      <Button
        variant="secondary"
        text="Cancel"
        onClick={() => navigation.pop()}
      />
    </Container>
  );
};

export default ChangeEmailScreen;
