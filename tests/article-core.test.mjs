import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  DEFAULT_BANNER, defaultsFor, descriptionFromBody, imageFormat, normalizeTerm,
  parseMarkdown, publishSafetyError, publishedArticleFiles, serializeMarkdown,
  slugify, stagedPathError, suggestGlossaryTerms, validateArticle,
} from "../scripts/article-core.mjs";
import { shareIntentUrl, SHARE_TEXT_LIMIT } from "../src/utils/share-intent.mjs";

const minimalJpeg = Buffer.from([0xff, 0xd8, 0xff, 0xd9]);

test("slug and glossary normalization are stable", () => {
  assert.equal(slugify("Why Carry an SLR?"), "why-carry-an-slr");
  assert.equal(slugify("Café & Cameras"), "cafe-and-cameras");
  assert.equal(normalizeTerm("  SLR—Camera "), "slr camera");
});

test("frontmatter parses and serializes without changing article body", () => {
  const parsed = parseMarkdown('---\ntitle: "A title"\ntags:\n  - writing\n---\n\nBody text.');
  assert.equal(parsed.data.title, "A title");
  assert.equal(parsed.body, "Body text.");
  assert.deepEqual(parseMarkdown(serializeMarkdown(parsed.data, parsed.body)), parsed);
  assert.throws(() => parseMarkdown("# Missing frontmatter"), /frontmatter/);
  assert.throws(() => parseMarkdown("---\ntitle: [\n---\nbody"));
});

test("article check reports malformed YAML without a secondary crash", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "article-check-"));
  const file = path.join(directory, "malformed.md");
  try {
    writeFileSync(file, "---\ntitle: [\n---\nBody text.");
    const result = spawnSync(process.execPath, ["scripts/article.mjs", "check", file], { encoding: "utf8" });
    assert.equal(result.status, 1);
    const output = `${result.stdout}\n${result.stderr}`;
    assert.match(output, /Error: Flow sequence in block collection/);
    assert.doesNotMatch(output, /Cannot read properties of undefined.*map/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("metadata defaults and descriptions are useful", () => {
  const fixed = new Date(2026, 9, 21, 12);
  const metadata = defaultsFor({ title: "  New article  " }, "A useful opening paragraph.", fixed);
  assert.equal(metadata.title, "New article");
  assert.equal(metadata.description, "A useful opening paragraph.");
  assert.equal(metadata.date, "2026-10-21");
  assert.equal(metadata.createdAt, "2026-10-21");
  assert.equal(metadata.type, "Essay");
  assert.equal(metadata.draft, false);
  const description = descriptionFromBody("# Heading\n\n" + "thought ".repeat(40));
  assert.ok(description.length <= 160);
  assert.ok(description.endsWith("…"));
});

test("image signatures and Writing default banner are valid", () => {
  assert.equal(imageFormat(minimalJpeg), "jpeg");
  assert.equal(imageFormat(Buffer.from("not an image")), undefined);
  const root = path.resolve(import.meta.dirname, "..");
  assert.notEqual(imageFormat(readFileSync(path.join(root, "public", DEFAULT_BANNER.slice(1)))), undefined);
});

test("article validation catches missing, unsupported, oversized images and collisions", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "article-validation-"));
  const sourceDir = path.join(root, "drafts");
  mkdirSync(path.join(root, "src/content/writing"), { recursive: true });
  mkdirSync(sourceDir, { recursive: true });
  const writeArticle = (heroImage, filename = "draft.md") => {
    const file = path.join(sourceDir, filename);
    writeFileSync(file, serializeMarkdown({ title: "A Useful Camera Essay", description: "A short description", heroImage, heroImageAlt: "A camera" }, "Article body."));
    return validateArticle(file, root);
  };
  try {
    assert.match(writeArticle("missing.jpg").errors.join(" "), /does not exist/);
    writeFileSync(path.join(sourceDir, "bad.jpg"), "not a jpeg");
    assert.match(writeArticle("bad.jpg").errors.join(" "), /invalid image format/);
    writeFileSync(path.join(sourceDir, "large.jpg"), Buffer.concat([minimalJpeg, Buffer.alloc(10 * 1024 * 1024 + 1)]));
    assert.match(writeArticle("large.jpg").errors.join(" "), /limit is 10 MB/);
    const invalidDate = path.join(sourceDir, "invalid-date.md");
    writeFileSync(invalidDate, serializeMarkdown({ title: "Invalid Date", date: "2026-02-30" }, "Body"));
    assert.match(validateArticle(invalidDate, root).errors.join(" "), /valid date/);
    writeFileSync(path.join(root, "src/content/writing/a-useful-camera-essay.md"), "---\ntitle: Existing\n---\nBody");
    mkdirSync(path.join(root, "src/content/writing/archive"), { recursive: true });
    writeFileSync(path.join(root, "src/content/writing/archive/older-essay.md"), "---\ntitle: Archived\n---\nBody");
    assert.match(writeArticle(undefined).errors.join(" "), /already uses slug/);
    assert.ok(publishedArticleFiles(root).includes("a-useful-camera-essay"));
    assert.ok(publishedArticleFiles(root).includes("archive/older-essay"));
    mkdirSync(path.join(root, "src/pages/writing/occupied"), { recursive: true });
    writeFileSync(path.join(root, "src/pages/writing/occupied/index.astro"), "---\n---");
    const routeCollision = path.join(sourceDir, "route-collision.md");
    writeFileSync(routeCollision, serializeMarkdown({ title: "Occupied" }, "Body"));
    assert.match(validateArticle(routeCollision, root).errors.join(" "), /conflict with an existing Astro route/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("glossary candidates are deterministic and exclude common filler", () => {
  const article = { title: "Deliberate Camera Practice", description: "Learning camera practice", tags: ["photography"] };
  const first = suggestGlossaryTerms(article, "Camera practice rewards deliberate camera practice. Camera practice helps.");
  assert.deepEqual(first, suggestGlossaryTerms(article, "Camera practice rewards deliberate camera practice. Camera practice helps."));
  assert.ok(first.includes("camera practice"));
  assert.ok(!first.includes("the"));
});

test("X intent encodes canonical URL and limits suggested text", () => {
  const longText = "📷".repeat(SHARE_TEXT_LIMIT + 20);
  const url = new URL(shareIntentUrl("https://vtrrk.in/writing/example/?a=1&b=2", "Example", longText));
  assert.equal(url.hostname, "x.com");
  assert.equal(url.pathname, "/intent/tweet");
  assert.equal(url.searchParams.get("url"), "https://vtrrk.in/writing/example/?a=1&b=2");
  assert.equal(Array.from(url.searchParams.get("text")).length, SHARE_TEXT_LIMIT);
});

test("publisher Git guard and exact-path staging reject unsafe states", () => {
  const safe = { branch: "main", status: "", upstream: "origin/main", local: "abc", remote: "abc" };
  assert.equal(publishSafetyError(safe), undefined);
  assert.match(publishSafetyError({ ...safe, branch: "feature" }), /only from main/);
  assert.match(publishSafetyError({ ...safe, status: " M README.md" }), /not clean/);
  assert.match(publishSafetyError({ ...safe, upstream: "origin/other" }), /track origin\/main/);
  assert.match(publishSafetyError({ ...safe, local: "abc", remote: "def" }), /not synchronized/);
  assert.equal(stagedPathError(["article.md", "image.jpg"], ["article.md", "image.jpg"]), undefined);
  assert.match(stagedPathError(["article.md", "README.md"], ["article.md"]), /Unexpected staged file/);
  assert.match(stagedPathError(["article.md"], ["article.md", "image.jpg"]), /was not staged/);
});
