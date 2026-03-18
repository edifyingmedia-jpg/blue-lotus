// frontend/src/engine/index.js

/**
 * index.js
 * --------
 * Engine bootstrap.
 * Creates the engine, initializes it, and exposes it
 * to the React app through a simple hook.
 */

import { useEffect, useRef, useState } from "react";
import { Engine } from "./Engine";

export function useEngine() {
    const engineRef = useRef(null);
    const [, forceUpdate] = useState(0);

    if (!engineRef.current) {
        engineRef.current = new Engine();
    }

    const engine = engineRef.current;

    // Initialize once
    useEffect(() => {
        engine.init();

        // Re-render whenever engine state changes
        const interval = setInterval(() => {
            forceUpdate(x => x + 1);
        }, 120);

        return () => clearInterval(interval);
    }, [engine]);

    return engine;
}
