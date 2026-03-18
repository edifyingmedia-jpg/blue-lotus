// frontend/src/screens/ProjectsScreen.jsx

import React from "react";
import Container from "../components/Container";
import Text from "../components/Text";
import Button from "../components/Button";
import Spacer from "../components/Spacer";

/**
 * ProjectsScreen
 * ---------------------------------------------------------
 * Displays a simple list of projects.
 * This is a placeholder until the real project loader UI is built.
 */

const ProjectsScreen = ({ navigation }) => {
  return (
    <Container>
      <Text size="1.4rem" weight={600}>
        Projects
      </Text>

      <Text color="rgba(255,255,255,0.8)">
        Your projects will appear here once the editor is connected.
      </Text>

      <Spacer size="1.5rem" />

      <Button
        text="Open Project Detail"
        onClick={() => navigation.push("ProjectDetail")}
      />

      <Spacer size="1rem" />

      <Button
        variant="secondary"
        text="Back to Dashboard"
        onClick={() => navigation.pop()}
      />
    </Container>
  );
};

export default ProjectsScreen;
