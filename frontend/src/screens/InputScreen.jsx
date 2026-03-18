// frontend/src/screens/InputScreen.jsx

import React, { useState } from "react";
import Container from "../components/Container";
import Text from "../components/Text";
import Input from "../components/Input";
import Button from "../components/Button";
import Spacer from "../components/Spacer";

/**
 * InputScreen
 * ---------------------------------------------------------
 * A simple screen demonstrating input usage.
 * This corresponds to Input.json in your screens folder.
 */

const InputScreen = ({ navigation }) => {
  const [value, setValue] = useState("");

  return (
    <Container>
      <Text size="1.4rem" weight={600}>
        Input Demo
      </Text>

      <Text color="rgba(255,255,255,0.8)">
        Type something below to test input handling.
      </Text>

      <Spacer size="1.5rem" />

      <Input
        placeholder="Type here..."
        value={value}
        onChange={setValue}
      />

      <Spacer size="1.5rem" />

      <Button
        text="Clear"
        onClick={() => setValue("")}
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

export default InputScreen;
