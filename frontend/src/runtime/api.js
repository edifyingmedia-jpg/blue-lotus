/**
 * api.js
 * ------
 * Unified API helper for Blue Lotus.
 * Handles:
 *  - GET, POST, PUT, DELETE
 *  - JSON parsing
 *  - Error handling
 *  - Optional auth token injection
 */

export async function apiRequest({
  url,
  method = "GET",
  body = null,
  token = null,
}) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "API request failed");
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("[API ERROR]", error);

    return {
      success: false,
      error: error.message,
    };
  }
}
