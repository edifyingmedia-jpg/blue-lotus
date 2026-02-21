// Safe fetch utilities to prevent "body stream already read" errors

export const safeJSON = async (response) => {
  try {
    const text = await response.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch (e) {
    console.error('JSON parse error:', e);
    return null;
  }
};

export const safeFetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  return {
    ok: response.ok,
    status: response.status,
    data: await safeJSON(response)
  };
};
