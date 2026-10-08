// "?next=" comes from the URL, so it is user input. Only allow paths on our
// own site: "/admin" yes, "//evil.com" or "https://evil.com" no.
export function safeNext(value: unknown): string {
  if (typeof value !== "string") return "/";
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return "/";
  }
  return value;
}
