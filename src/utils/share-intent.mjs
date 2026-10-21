export const SHARE_TEXT_LIMIT = 200;

export function shareIntentUrl(articleUrl, title, customText = "") {
  const proposed = String(customText || title || "").replace(/\s+/g, " ").trim();
  const text = Array.from(proposed).slice(0, SHARE_TEXT_LIMIT).join("");
  const url = new URL("https://x.com/intent/tweet");
  url.searchParams.set("text", text);
  url.searchParams.set("url", articleUrl);
  return url.toString();
}
