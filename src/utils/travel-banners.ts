const banners: Record<string, { name: string; sourceWidth: number }> = {
  "/images/travel/amarnath.jpg": { name: "amarnath", sourceWidth: 1860 },
  "/images/travel/amritsar.jpg": { name: "amritsar", sourceWidth: 1600 },
  "/images/travel/armenia.jpg": { name: "armenia", sourceWidth: 1400 },
  "/images/travel/australia.jpg": { name: "australia", sourceWidth: 2048 },
  "/images/travel/azerbaijan.jpg": { name: "azerbaijan", sourceWidth: 3968 },
  "/images/travel/darjeeling.jpg": { name: "darjeeling", sourceWidth: 1965 },
  "/images/travel/default.jpg": { name: "default", sourceWidth: 1728 },
  "/images/travel/georgia.jpg": { name: "georgia", sourceWidth: 4898 },
  "/images/travel/italy.jpg": { name: "italy", sourceWidth: 2048 },
  "/images/travel/jordan.jpg": { name: "jordan", sourceWidth: 1600 },
  "/images/travel/kodaikanal.jpg": { name: "kodaikanal", sourceWidth: 1600 },
  "/images/travel/ladakh.jpg": { name: "ladakh", sourceWidth: 1510 },
  "/images/travel/malaysia.jpg": { name: "malaysia", sourceWidth: 8064 },
  "/images/travel/mauritius.jpg": { name: "mauritius", sourceWidth: 1920 },
  "/images/travel/munnar.jpg": { name: "munnar", sourceWidth: 4032 },
  "/images/travel/portugal.jpg": { name: "portugal", sourceWidth: 1920 },
  "/images/travel/rajasthan.jpg": { name: "rajasthan", sourceWidth: 2048 },
  "/images/travel/seychelles.jpg": { name: "seychelles", sourceWidth: 4898 },
  "/images/travel/singapore.jpg": { name: "singapore", sourceWidth: 1329 },
  "/images/travel/somnath.jpg": { name: "somnath", sourceWidth: 1264 },
  "/images/travel/srilanka.jpg": { name: "srilanka", sourceWidth: 4032 },
  "/images/travel/thailand.jpg": { name: "thailand", sourceWidth: 4898 },
  "/images/travel/uk.jpg": { name: "uk", sourceWidth: 1832 },
  "/images/travel/usa.jpg": { name: "usa", sourceWidth: 2048 },
  "/images/travel/varanasi.jpg": { name: "varanasi", sourceWidth: 4821 },
  "/images/travel/zurich.jpg": { name: "zurich", sourceWidth: 4898 },
};

export const travelBannerWidths = [240, 480, 960, 1600, 2160] as const;

export function getTravelBannerSources(src: string | undefined) {
  const banner = src ? banners[src] : undefined;
  if (!banner) return undefined;
  const widths = travelBannerWidths.filter((width) => width < banner.sourceWidth);

  const makeSrcset = (extension: "avif" | "jpg") =>
    widths
      .map((width) => `/images/travel/responsive/${banner.name}-${width}.${extension} ${width}w`)
      .join(", ");

  return { avif: makeSrcset("avif"), jpeg: makeSrcset("jpg") };
}
