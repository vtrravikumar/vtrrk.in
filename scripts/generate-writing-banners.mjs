import path from "node:path";
import { fileURLToPath } from "node:url";
import { emitWritingBannerVariants, prepareWritingBannerVariants } from "./writing-banner-generator.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const artifacts = {
  root,
  cacheDirectory: path.join(root, ".local/writing-banner-variants"),
  manifestPath: path.join(root, ".local/writing-banner-variants.json"),
  distDirectory: path.join(root, "dist"),
};

const phase = process.argv[2];
if (phase === "prepare") {
  await prepareWritingBannerVariants(artifacts);
} else if (phase === "emit") {
  await emitWritingBannerVariants(artifacts);
} else {
  throw new Error("Use `prepare` before Astro builds and `emit` after Astro builds.");
}
