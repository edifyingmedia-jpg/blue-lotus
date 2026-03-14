// EditorProvider.jsx

"use client";

import React, { useEffect, useRef } from "react";
import { EditorProvider as EngineProvider } from "./EditorContext";

export default function EditorProvider({ children }) {
  return <EngineProvider>{children}</EngineProvider>;
}
