// frontend/src/screens/ImageScreen.jsx

import React from "react";
import Container from "../components/Container";
import Text from "../components/Text";
import Image from "../components/Image";
import Button from "../components/Button";
import Spacer from "../components/Spacer";

/**
 * ImageScreen
 * ---------------------------------------------------------
 * Demonstrates image rendering using your custom Image component.
 * This corresponds to Image.json in your screens folder.
 */

const ImageScreen = ({ navigation }) => {
  return (
    <Container>
      <Text size="1.6rem" weight={700}>
        Image Demo
      </Text>

      <Spacer size="1.25rem" />

      <Image
        src="https://placekitten.com/400/250"
        alt="Demo image"
        width="100%"
        height="auto"
      />

      <Spacer size="1.5rem" />

      <Button
        variant="secondary"
        text="Back"
        onClick={() => navigation.pop()}
      />
    </Container>
  );
};

export default ImageScreen;
