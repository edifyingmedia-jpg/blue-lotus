// frontend/src/screens/ChangePasswordScreen.jsx

import React, { useState } from "react";
import Container from "../components/Container";
import Text from "../components/Text";
import Input from "../components/Input";
import Button from "../components/Button";
import Spacer from "../components/Spacer";

/**
 * ChangePasswordScreen
 * ---------------------------------------------------------
 * A simple placeholder screen for updating the user's password.
 * This will later connect to authentication + backend logic.
 */

const ChangePasswordScreen = ({ navigation }) => {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <Container>
      <Text size="1.4rem" weight={600}>
        Change Password
      </Text>

      <Text color="rgba(255,255,255,0.8)">
        Update your password below.
      </Text>

      <Spacer size="1.5rem" />

      <Input
        placeholder="Current password"
        type="password"
        value={current}
        onChange={setCurrent}
      />

      <Spacer size="1rem" />

      <Input
        placeholder="New password"
        type="password"
        value={next}
        onChange={setNext}
      />

      <Spacer size="1rem" />

      <Input
        placeholder="Confirm new password"
        type="password"
        value={confirm}
        onChange={setConfirm}
      />

      <Spacer size="1.5rem" />

      <Button
        text="Save Password"
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

export default ChangePasswordScreen;
