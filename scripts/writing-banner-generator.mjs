import fs from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { DEFAULT_BANNER, parseMarkdown, publishedArticleFiles } from "./article-core.mjs";
import { writingBannerVariantUrl, writingBannerWidths } from "../src/utils/writing-banner-variants.mjs";

function within(parent, target) {
  const relative = path.relative(parent, target);
  return relative !== "" && relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}

function bannerUrls(root) {
  const writingDirectory = path.join(root, "src/content/writing");
  const urls = new Set([DEFAULT_BANNER]);
  for (const slug of publishedArticleFiles(root)) {
    const articlePath = path.join(writingDirectory, `${slug}.md`);
    const { data } = parseMarkdown(readFileSync(articlePath, "utf8"));
    if (data.draft === true || typeof data.heroImage !== "string" || !data.heroImage.startsWith("/")) continue;
    urls.add(data.heroImage.split(/[?#]/, 1)[0]);
  }
  return [...urls].sort();
}

export async function prepareWritingBannerVariants({ root, cacheDirectory, manifestPath }) {
  const projectRoot = path.resolve(root);
  const publicRoot = path.join(projectRoot, "public");
  const cacheRoot = path.resolve(cacheDirectory ?? path.join(projectRoot, ".local/writing-banner-variants"));
  const outputManifest = path.resolve(manifestPath ?? path.join(projectRoot, ".local/writing-banner-variants.json"));
  if (!within(projectRoot, cacheRoot) || !within(projectRoot, outputManifest)) throw new Error("Writing banner build artifacts must stay inside the repository.");

  await fs.rm(cacheRoot, { recursive: true, force: true });
  await fs.mkdir(cacheRoot, { recursive: true });
  const manifest = {};
  const generatedPathOwners = new Map();

  for (const url of bannerUrls(projectRoot)) {
    const source = path.resolve(publicRoot, `.${url}`);
    if (!within(publicRoot, source)) continue;
    try {
      const stat = await fs.stat(source);
      if (!stat.isFile()) continue;
      const metadata = await sharp(source).metadata();
      if (!metadata.width || !metadata.height) continue;

      const variants = { width: metadata.width, height: metadata.height, avif: [], webp: [] };
      for (const width of writingBannerWidths) {
        if (width >= metadata.width) continue;
        for (const format of ["avif", "webp"]) {
          const src = writingBannerVariantUrl(url, width, format);
          const fileName = path.basename(src);
          const previousOwner = generatedPathOwners.get(fileName);
          if (previousOwner && previousOwner !== url) {
            throw new Error(`Writing banner variant filename collision between ${previousOwner} and ${url}: ${fileName}`);
          }
          generatedPathOwners.set(fileName, url);
          const cachePath = path.join(cacheRoot, fileName);
          const image = sharp(source).resize({ width, withoutEnlargement: true });
          const output = format === "avif"
            ? image.avif({ quality: 50, effort: 5 })
            : image.webp({ quality: 80, effort: 4 });
          const result = await output.toFile(cachePath);
          variants[format].push({ width: result.width, src, fileName });
        }
      }
      manifest[url] = variants;
    } catch (error) {
      if (error.code === "ENOENT") continue;
      throw new Error(`Could not generate Writing banner variants for ${url}: ${error.message}`, { cause: error });
    }
  }

  await fs.mkdir(path.dirname(outputManifest), { recursive: true });
  await fs.writeFile(outputManifest, `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}

export async function emitWritingBannerVariants({ root, cacheDirectory, manifestPath, distDirectory }) {
  const projectRoot = path.resolve(root);
  const cacheRoot = path.resolve(cacheDirectory ?? path.join(projectRoot, ".local/writing-banner-variants"));
  const outputManifest = path.resolve(manifestPath ?? path.join(projectRoot, ".local/writing-banner-variants.json"));
  const outputRoot = path.resolve(distDirectory ?? path.join(projectRoot, "dist"));
  if (!within(projectRoot, cacheRoot) || !within(projectRoot, outputManifest) || !within(projectRoot, outputRoot)) {
    throw new Error("Writing banner build artifacts must stay inside the repository.");
  }

  const manifest = JSON.parse(await fs.readFile(outputManifest, "utf8"));
  for (const entry of Object.values(manifest)) {
    for (const format of ["avif", "webp"]) {
      for (const variant of entry[format] ?? []) {
        const destination = path.resolve(outputRoot, `.${variant.src}`);
        if (!within(outputRoot, destination)) throw new Error(`Writing banner variant path escapes dist/: ${variant.src}`);
        const source = path.resolve(cacheRoot, variant.fileName);
        if (path.basename(variant.fileName) !== variant.fileName || !within(cacheRoot, source)) {
          throw new Error(`Writing banner cache path escapes its generated directory: ${variant.fileName}`);
        }
        await fs.mkdir(path.dirname(destination), { recursive: true });
        await fs.copyFile(source, destination);
      }
    }
  }

  await fs.rm(cacheRoot, { recursive: true, force: true });
  await fs.rm(outputManifest, { force: true });
  return manifest;
}
