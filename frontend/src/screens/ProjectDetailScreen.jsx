// frontend/src/screens/ProjectDetailScreen.jsx

import React from "react";
import Container from "../components/Container";
import Text from "../components/Text";
import Button from "../components/Button";
import Spacer from "../components/Spacer";

/**
 * ProjectDetailScreen
 * ---------------------------------------------------------
 * Displays details for a single project.
 * Placeholder until real project data is wired in.
 */

const ProjectDetailScreen = ({ navigation }) => {
  return (
    <Container>
      <Text size="1.4rem" weight={600}>
        Project Detail
      </Text>

      <Text color="rgba(255,255,255,0.8)">
        This is where project information will appear.
      </Text>

      <Spacer size="1.5rem" />

      <Button
        text="Back to Projects"
        onClick={() => navigation.pop()}
      />

      <Spacer size="1rem" />

      <Button
        variant="secondary"
        text="Go Home"
        onClick={() => navigation.reset("Home")}
      />
    </Container>
  );
};

export default ProjectDetailScreen;
