// frontend/src/screens/CreateNewScreen.jsx

import React, { useState } from "react";
import Container from "../components/Container";
import Text from "../components/Text";
import Input from "../components/Input";
import Button from "../components/Button";
import Spacer from "../components/Spacer";

/**
 * CreateNewScreen
 * ---------------------------------------------------------
 * A placeholder screen for creating a new project.
 * This will later connect to the real project creation flow.
 */

const CreateNewScreen = ({ navigation }) => {
  const [name, setName] = useState("");

  return (
    <Container>
      <Text size="1.4rem" weight={600}>
        Create New Project
      </Text>

      <Text color="rgba(255,255,255,0.8)">
        Give your new project a name to get started.
      </Text>

      <Spacer size="1.5rem" />

      <Input
        placeholder="Project name"
        value={name}
        onChange={setName}
      />

      <Spacer size="1.5rem" />

      <Button
        text="Create Project"
        onClick={() => {
          // Placeholder until backend is connected
          navigation.push("ProjectDetail");
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

export default CreateNewScreen;
