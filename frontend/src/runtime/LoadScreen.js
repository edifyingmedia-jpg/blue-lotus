/**
 * loadScreen.js
 * --------------
 * Loads a screen JSON definition by name or ID.
 *
 * Supports:
 *  - Local development screens (from /screens folder)
 *  - Remote Supabase screens (optional)
 */

export async function loadScreen(screenName) {
  if (!screenName) {
    console.warn("⚠ loadScreen: No screen name provided.");
    return null;
  }

  // 1. Try loading from local JSON (development mode)
  try {
    const localScreen = await import(`../screens/${screenName}.json`);
    return localScreen.default || localScreen;
  } catch (err) {
    console.info(`ℹ No local screen found for "${screenName}". Checking Supabase...`);
  }

  // 2. Try loading from Supabase (if configured)
  try {
    if (!window.supabase) {
      console.warn("⚠ Supabase client not found on window.supabase.");
      return null;
    }

    const { data, error } = await window.supabase
      .from("screens")
      .select("*")
      .eq("name", screenName)
      .single();

    if (error) {
      console.error("❌ Supabase error loading screen:", error);
      return null;
    }

    return data?.json || null;
  } catch (err) {
    console.error("❌ Error loading screen from Supabase:", err);
    return null;
  }
}
