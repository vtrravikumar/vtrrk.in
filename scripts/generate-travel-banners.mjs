import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Astro already installs Sharp as an optional image-processing dependency.
// Derivatives live in a separate directory; original public URLs are untouched.
const names = [
  "amarnath", "amritsar", "armenia", "australia", "azerbaijan", "darjeeling",
  "default", "georgia", "italy", "jordan", "kodaikanal", "ladakh", "malaysia",
  "mauritius", "munnar", "portugal", "rajasthan", "seychelles", "singapore",
  "somnath", "srilanka", "thailand", "uk", "usa", "varanasi", "zurich",
];
const widths = [240, 480, 960, 1600, 2160];
const sourceDirectory = path.resolve("public/images/travel");
const outputDirectory = path.join(sourceDirectory, "responsive");

await fs.mkdir(outputDirectory, { recursive: true });

for (const name of names) {
  const source = path.join(sourceDirectory, `${name}.jpg`);
  const metadata = await sharp(source).metadata();
  if (!metadata.width) throw new Error(`Could not read dimensions for ${source}`);

  for (const width of widths) {
    if (width >= metadata.width) continue;

    const avifOutput = path.join(outputDirectory, `${name}-${width}.avif`);
    const jpegOutput = path.join(outputDirectory, `${name}-${width}.jpg`);
    const existing = await Promise.all([
      fs.access(avifOutput).then(() => true, () => false),
      fs.access(jpegOutput).then(() => true, () => false),
    ]);
    if (existing.every(Boolean)) continue;

    const image = sharp(source).resize({ width, withoutEnlargement: true });
    const outputs = [];
    if (!existing[0]) outputs.push(image.clone().avif({ quality: 50, effort: 5 }).toFile(avifOutput));
    if (!existing[1]) outputs.push(image.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(jpegOutput));
    await Promise.all(outputs);
  }
}

console.log(`Generated AVIF and JPEG travel banner variants in ${outputDirectory}`);
