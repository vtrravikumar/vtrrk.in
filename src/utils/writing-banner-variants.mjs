import { createHash } from "node:crypto";

export const writingBannerWidths = [320, 480, 768, 960, 1280, 1600];
export const writingBannerSizes = "(max-width: 600px) calc(100vw - 2rem), (max-width: 948px) calc(100vw - 3rem), 900px";

export function normalizeWritingBannerUrl(value) {
  const url = String(value ?? "").split(/[?#]/, 1)[0];
  return url.startsWith("/") ? url : undefined;
}

export function writingBannerKey(value) {
  const url = normalizeWritingBannerUrl(value);
  if (!url) return undefined;
  return url.replace(/^\/+|\/+$/g, "")
    .replace(/\.[^.\/]+$/, "")
    .toLocaleLowerCase("en")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function writingBannerVariantUrl(value, width, format) {
  const key = writingBannerKey(value);
  if (!key || !Number.isInteger(width) || !["avif", "webp"].includes(format)) return undefined;
  const normalizedUrl = normalizeWritingBannerUrl(value);
  const hash = createHash("sha256").update(normalizedUrl).digest("hex").slice(0, 12);
  return `/images/writing/responsive/${key}-${hash}-${width}.${format}`;
}

export function getWritingBannerVariants(value, manifest) {
  const url = normalizeWritingBannerUrl(value);
  const entry = url ? manifest?.[url] : undefined;
  if (!entry || !Number.isInteger(entry.width) || !Number.isInteger(entry.height)) return undefined;

  const makeSrcset = (format) => (entry[format] ?? [])
    .filter((variant) => Number.isInteger(variant.width) && variant.src)
    .map((variant) => `${variant.src} ${variant.width}w`)
    .join(", ");

  return {
    width: entry.width,
    height: entry.height,
    avifSrcset: makeSrcset("avif"),
    webpSrcset: makeSrcset("webp"),
  };
}
