// frontend/src/screens/Home_lowercase_Screen.jsx

import React from "react";
import Container from "../components/Container";
import Text from "../components/Text";
import Button from "../components/Button";
import Spacer from "../components/Spacer";

/**
 * Home_lowercase_Screen
 * ---------------------------------------------------------
 * This screen corresponds to `home.json` (lowercase).
 * It is separate from HomeScreen.jsx and used for flows
 * that reference the lowercase route.
 */

const Home_lowercase_Screen = ({ navigation }) => {
  return (
    <Container>
      <Text size="1.4rem" weight={600}>
        Home (lowercase)
      </Text>

      <Text color="rgba(255,255,255,0.8)">
        This screen is mapped from home.json.
      </Text>

      <Spacer size="1.5rem" />

      <Button
        text="Go to Dashboard"
        onClick={() => navigation.push("Dashboard")}
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

export default Home_lowercase_Screen;
