export function navigateTo(navigate, target) {
  if (!navigate || !target) return;

  if (typeof target === "string") {
    navigate(`/screen/${target}`);
    return;
  }

  if (target?.screen) {
    navigate(`/screen/${target.screen}`);
    return;
  }

  console.warn("Invalid navigation target", target);
}

export function goBack(navigate) {
  if (!navigate) return;
  navigate(-1);
}
