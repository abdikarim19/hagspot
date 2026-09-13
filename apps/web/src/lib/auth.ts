export function getSafeRedirectPath(value: string | null, fallback = "/account") {
  if (value?.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  return fallback;
}
