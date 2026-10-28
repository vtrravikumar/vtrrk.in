import sharp from "sharp";
import { access } from "node:fs/promises";
import path from "node:path";

const publicImages = path.resolve("public/images");
const input = path.join(publicImages, "Cozy Vichar Creative Workspace.png");
const output = path.join(publicImages, "vichar-hero-portrait.webp");

await access(input);
const result = await sharp(input)
  .rotate()
  .resize(900, 900, { fit: "inside", withoutEnlargement: true })
  .webp({ quality: 84, effort: 5 })
  .toFile(output);

console.log(`Optimized Vichar hero portrait: ${result.width}x${result.height}, ${result.size} bytes`);
