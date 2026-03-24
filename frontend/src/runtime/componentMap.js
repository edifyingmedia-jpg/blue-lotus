/**
 * componentMap.js
 * ----------------------------------------------------
 * Maps component type strings to actual component modules.
 *
 * This is used by ComponentResolver.js to look up the
 * correct component implementation at runtime.
 *
 * Every component used in screens MUST be registered here.
 */

import Button from "../components/Button";
import Text from "../components/Text";
import Input from "../components/Input";
import Image from "../components/Image";
import Container from "../components/Container";
import List from "../components/List";
import Spacer from "../components/Spacer";

// Add new components here as you build your library
const componentMap = {
  Button,
  Text,
  Input,
  Image,
  Container,
  List,
  Spacer,
};

export default componentMap;
