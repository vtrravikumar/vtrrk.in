import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import sharp from "sharp";
import { emitWritingBannerVariants, prepareWritingBannerVariants } from "../scripts/writing-banner-generator.mjs";
import {
  getWritingBannerVariants,
  writingBannerSizes,
  writingBannerVariantUrl,
} from "../src/utils/writing-banner-variants.mjs";

async function fixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), "writing-banners-"));
  const imagePath = path.join(root, "public/images/writing/sample.jpg");
  await mkdir(path.dirname(imagePath), { recursive: true });
  await mkdir(path.join(root, "src/content/writing"), { recursive: true });
  await sharp({ create: { width: 1800, height: 1000, channels: 3, background: "#bd7842" } })
    .jpeg({ quality: 85 })
    .toFile(imagePath);
  await mkdir(path.join(root, "public/images/travel"), { recursive: true });
  await writeFile(path.join(root, "public/images/travel/default.jpg"), await sharp({
    create: { width: 1000, height: 600, channels: 3, background: "#28465a" },
  }).jpeg().toBuffer());
  await writeFile(path.join(root, "src/content/writing/sample.md"), [
    "---", 'title: "Sample article"', 'heroImage: "/images/writing/sample.jpg"', "---", "", "Body.",
  ].join("\n"));
  return { root, imagePath };
}

test("Writing banner variants use stable URLs, responsive sizes, and original dimensions", () => {
  assert.equal(writingBannerVariantUrl("/images/writing/sample.jpg?x=1", 768, "avif"), writingBannerVariantUrl("/images/writing/sample.jpg", 768, "avif"));
  assert.match(writingBannerVariantUrl("/images/writing/sample.jpg", 768, "avif"), /images-writing-sample-[a-f0-9]{12}-768\.avif$/);
  assert.match(writingBannerSizes, /900px$/);
  assert.equal(writingBannerVariantUrl("https://example.com/image.jpg", 768, "avif"), undefined);

  const variants = getWritingBannerVariants("/images/writing/sample.jpg", {
    "/images/writing/sample.jpg": {
      width: 1800,
      height: 1000,
      avif: [{ width: 768, src: "/images/writing/responsive/sample-768.avif" }],
      webp: [{ width: 768, src: "/images/writing/responsive/sample-768.webp" }],
    },
  });
  assert.deepEqual([variants.width, variants.height], [1800, 1000]);
  assert.equal(variants.avifSrcset, "/images/writing/responsive/sample-768.avif 768w");
  assert.equal(getWritingBannerVariants("/images/writing/missing.jpg", {}), undefined);
});

test("build creates optimized format variants in dist and refreshes them when a source changes", async (t) => {
  const { root, imagePath } = await fixture();
  t.after(() => rm(root, { recursive: true, force: true }));
  const cacheDirectory = path.join(root, ".local/writing-banner-variants");
  const manifestPath = path.join(root, ".local/writing-banner-variants.json");
  const distDirectory = path.join(root, "dist");
  const options = { root, cacheDirectory, manifestPath, distDirectory };

  const firstManifest = await prepareWritingBannerVariants(options);
  const firstArticle = firstManifest["/images/writing/sample.jpg"];
  assert.deepEqual([firstArticle.width, firstArticle.height], [1800, 1000]);
  assert.deepEqual(firstArticle.avif.map(({ width }) => width), [320, 480, 768, 960, 1280, 1600]);
  assert.equal(firstArticle.webp.length, 6);
  assert.equal(await readFile(imagePath).then((value) => value.length > 0), true);

  await emitWritingBannerVariants(options);
  const output = path.join(distDirectory, firstArticle.avif[2].src.slice(1));
  assert.equal((await sharp(output).metadata()).format, "heif");
  assert.equal((await sharp(output).metadata()).width, 768);
  assert.ok((await stat(output)).size < (await stat(imagePath)).size);
  const firstOutput = await readFile(output);

  await sharp({ create: { width: 1800, height: 1000, channels: 3, background: "#263b65" } })
    .jpeg({ quality: 85 })
    .toFile(imagePath);
  const secondManifest = await prepareWritingBannerVariants(options);
  assert.deepEqual(secondManifest["/images/writing/sample.jpg"].avif, firstArticle.avif);
  await emitWritingBannerVariants(options);
  assert.equal((await sharp(output).metadata()).width, 768);
  assert.notDeepEqual(await readFile(output), firstOutput);
});

test("normalized filename collisions keep variants distinct and tied to each source image", async (t) => {
  const { root } = await fixture();
  t.after(() => rm(root, { recursive: true, force: true }));
  const underscoreImage = path.join(root, "public/images/writing/banner_a.jpg");
  const hyphenImage = path.join(root, "public/images/writing/banner-a.png");
  await sharp({ create: { width: 1000, height: 600, channels: 3, background: "#c92f25" } })
    .jpeg({ quality: 90 })
    .toFile(underscoreImage);
  await sharp({ create: { width: 1000, height: 600, channels: 3, background: "#214db0" } })
    .png()
    .toFile(hyphenImage);
  await writeFile(path.join(root, "src/content/writing/underscore.md"), [
    "---", 'title: "Underscore banner"', 'heroImage: "/images/writing/banner_a.jpg"', "---", "", "Body.",
  ].join("\n"));
  await writeFile(path.join(root, "src/content/writing/hyphen.md"), [
    "---", 'title: "Hyphen banner"', 'heroImage: "/images/writing/banner-a.png"', "---", "", "Body.",
  ].join("\n"));

  const options = {
    root,
    cacheDirectory: path.join(root, ".local/writing-banner-variants"),
    manifestPath: path.join(root, ".local/writing-banner-variants.json"),
    distDirectory: path.join(root, "dist"),
  };
  const manifest = await prepareWritingBannerVariants(options);
  const underscore = manifest["/images/writing/banner_a.jpg"];
  const hyphen = manifest["/images/writing/banner-a.png"];
  assert.ok(underscore && hyphen);
  assert.notEqual(underscore.avif[0].src, hyphen.avif[0].src);
  assert.notEqual(underscore.webp[0].src, hyphen.webp[0].src);
  assert.match(underscore.avif[0].src, /banner-a-[a-f0-9]{12}-320\.avif$/);
  assert.match(hyphen.avif[0].src, /banner-a-[a-f0-9]{12}-320\.avif$/);

  await emitWritingBannerVariants(options);
  const underscoreOutput = path.join(root, "dist", underscore.avif[0].src.slice(1));
  const hyphenOutput = path.join(root, "dist", hyphen.avif[0].src.slice(1));
  const underscoreStats = await sharp(underscoreOutput).stats();
  const hyphenStats = await sharp(hyphenOutput).stats();
  assert.ok(underscoreStats.channels[0].mean > underscoreStats.channels[2].mean * 1.5);
  assert.ok(hyphenStats.channels[2].mean > hyphenStats.channels[0].mean * 1.5);
});

test("unsafe public paths are not resolved outside public", async (t) => {
  const { root } = await fixture();
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeFile(path.join(root, "src/content/writing/sample.md"), [
    "---", 'title: "Sample article"', 'heroImage: "/../../private.jpg"', "---", "", "Body.",
  ].join("\n"));
  const manifest = await prepareWritingBannerVariants({ root });
  assert.equal(manifest["/../../private.jpg"], undefined);
  assert.equal(manifest["/images/travel/default.jpg"].width, 1000);
});
