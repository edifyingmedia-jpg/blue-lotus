// frontend/src/runtime/resolver/resolverComponents.js

/**
 * resolverComponents.js
 * ---------------------------------------------------------
 * Registry of REAL React components available to the runtime.
 *
 * This file is the authoritative map used by ComponentResolver
 * to turn a component "type" into an actual React component.
 *
 * Only production-grade components from:
 *   frontend/src/components/
 * may be registered here.
 */

import Text from "../../components/Text";
import Button from "../../components/Button";
import View from "../../components/View";
import Image from "../../components/Image";
import Input from "../../components/Input";
import Spacer from "../../components/Spacer";
import Card from "../../components/Card";
import Container from "../../components/Container";

// Add new components here as your platform grows.
// This registry must remain deterministic and owner-controlled.

const resolverComponents = {
  Text,
  Button,
  View,
  Image,
  Input,
  Spacer,
  Card,
  Container,
};

export default resolverComponents;
