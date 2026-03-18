// frontend/src/screens/LoginScreen.jsx

import React, { useState } from "react";
import Container from "../components/Container";
import Text from "../components/Text";
import Input from "../components/Input";
import Button from "../components/Button";
import Spacer from "../components/Spacer";

/**
 * LoginScreen
 * ---------------------------------------------------------
 * A simple placeholder login screen.
 * This will later connect to real authentication logic.
 */

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Container>
      <Text size="1.4rem" weight={600}>
        Welcome Back
      </Text>

      <Text color="rgba(255,255,255,0.8)">
        Log in to continue.
      </Text>

      <Spacer size="1.5rem" />

      <Input
        placeholder="Email"
        value={email}
        onChange={setEmail}
      />

      <Spacer size="1rem" />

      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={setPassword}
      />

      <Spacer size="1.5rem" />

      <Button
        text="Log In"
        onClick={() => {
          // Placeholder until backend is connected
          navigation.reset("Home");
        }}
      />

      <Spacer size="1rem" />

      <Button
        variant="secondary"
        text="Create Account"
        onClick={() => navigation.push("CreateNew")}
      />
    </Container>
  );
};

export default LoginScreen;
