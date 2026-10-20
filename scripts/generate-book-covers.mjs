import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const names = ["engineering-home", "gen-z", "the-white-envelope", "travelogue"];
const sourceDirectory = path.resolve("public/images/books");
const outputDirectory = path.join(sourceDirectory, "optimized");

await fs.mkdir(outputDirectory, { recursive: true });

for (const name of names) {
  const source = path.join(sourceDirectory, `${name}.png`);
  const metadata = await sharp(source).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`Could not read dimensions for ${source}`);
  }

  const image = sharp(source);
  await Promise.all([
    image.clone().avif({ quality: 75, effort: 6 }).toFile(path.join(outputDirectory, `${name}.avif`)),
    image.clone().webp({ quality: 82, effort: 6 }).toFile(path.join(outputDirectory, `${name}.webp`)),
  ]);
}

console.log(`Generated AVIF and WebP book covers in ${outputDirectory}`);
