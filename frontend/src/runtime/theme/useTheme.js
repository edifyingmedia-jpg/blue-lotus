/**
 * useTheme.js
 * ----------------------------------------------------
 * React hook for accessing the active theme and mode.
 *
 * This hook simply exposes the values provided by
 * ThemeProvider, which listens to ThemeEngine updates.
 */

import { useContext } from "react";
import ThemeProvider, { useThemeContext } from "./ThemeProvider";

export default function useTheme() {
  return useThemeContext();
}
