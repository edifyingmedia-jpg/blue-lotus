/**
 * ComponentRegistry.js
 * ---------------------------------------------------------
 * Maps component type strings to actual React components.
 *
 * This is how the Builder knows what to render when the AI
 * generates nodes like:
 *   { type: "BLText", props: {...} }
 */

import BLText from '../../runtime/components/BLText';
import BLButton from '../../runtime/components/BLButton';
import BLImage from '../../runtime/components/BLImage';
import BLInput from '../../runtime/components/BLInput';
import BLContainer from '../../runtime/components/BLContainer';

// Add more components here as your runtime grows

const ComponentRegistry = {
  BLText,
  BLButton,
  BLImage,
  BLInput,
  BLContainer,
};

export default ComponentRegistry;
