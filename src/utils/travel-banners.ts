const bannerNames: Record<string, string> = {
  "/images/travel/malaysia.jpg": "malaysia",
  "/images/travel/thailand.jpg": "thailand",
  "/images/travel/munnar.jpg": "munnar",
  "/images/travel/varanasi.jpg": "varanasi",
  "/images/travel/zurich.jpg": "zurich",
};

export const travelBannerWidths = [240, 480, 960, 1600, 2160] as const;

export function getTravelBannerSources(src: string | undefined) {
  const name = src ? bannerNames[src] : undefined;
  if (!name) return undefined;

  const makeSrcset = (extension: "avif" | "jpg") =>
    travelBannerWidths
      .map((width) => `/images/travel/responsive/${name}-${width}.${extension} ${width}w`)
      .join(", ");

  return { avif: makeSrcset("avif"), jpeg: makeSrcset("jpg") };
}
