// frontend/src/runtime/componentMap.js

/**
 * componentMap.js
 * ---------------------------------------------------------
 * Central registry mapping component type strings to the
 * actual React components used by the Blue Lotus runtime.
 *
 * This file is consumed by:
 *   - ComponentResolver
 *   - DynamicScreen
 *   - RenderScreen
 *
 * Only REAL runtime components belong here.
 */

import BLView from "../components/BLView";
import BLText from "../components/BLText";
import BLImage from "../components/BLImage";
import BLButton from "../components/BLButton";
import Input from "../components/Input";
import Spacer from "../components/Spacer";

/**
 * Component registry
 * ---------------------------------------------------------
 * Keys MUST match the "type" field in appDefinition nodes.
 */
const componentMap = {
  BLView,
  BLText,
  BLImage,
  BLButton,
  Input,
  Spacer,
};

export default componentMap;
