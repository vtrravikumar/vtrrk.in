import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  DEFAULT_BANNER, defaultsFor, descriptionFromBody, imageFormat, normalizeTerm,
  parseMarkdown, proposedChangePreview, publishSafetyError, publishedArticleFiles, serializeMarkdown,
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

test("article:new passes required --alt through when staging a custom banner privately", () => {
  const root = path.resolve(import.meta.dirname, "..");
  const directory = mkdtempSync(path.join(os.tmpdir(), "article-new-alt-"));
  const source = path.join(directory, "source.md");
  const banner = path.join(directory, "banner.jpg");
  const slug = "cli-banner-alt-regression";
  const draft = path.join(root, ".local/writing-drafts", `${slug}.md`);
  let stagedImage;
  try {
    writeFileSync(source, serializeMarkdown({ title: "CLI Banner Alt Regression", description: "A test draft" }, "Private body."));
    writeFileSync(banner, minimalJpeg);
    const result = spawnSync(process.execPath, ["scripts/article.mjs", "new", "--source", source, "--banner", banner, "--alt", "Camera and phone at sunset"], { cwd: root, encoding: "utf8" });
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
    const created = parseMarkdown(readFileSync(draft, "utf8"));
    assert.equal(created.data.heroImageAlt, "Camera and phone at sunset");
    assert.match(created.data.heroImage, /^assets\/cli-banner-alt-regression\//);
    stagedImage = path.join(root, ".local/writing-drafts", created.data.heroImage);
    assert.equal(readFileSync(stagedImage).toString("hex"), minimalJpeg.toString("hex"));
    assert.equal(existsSync(path.join(root, "public/images/writing", `${slug}-banner`)), false);

    const missingAltSource = path.join(directory, "missing-alt.md");
    writeFileSync(missingAltSource, serializeMarkdown({ title: "CLI Missing Alt Regression" }, "Private body."));
    const missing = spawnSync(process.execPath, ["scripts/article.mjs", "new", "--source", missingAltSource, "--banner", banner], { cwd: root, encoding: "utf8" });
    assert.equal(missing.status, 1);
    assert.match(`${missing.stdout}\n${missing.stderr}`, /Provide non-empty --alt text when using --banner/);
    assert.equal(existsSync(path.join(root, ".local/writing-drafts/cli-missing-alt-regression.md")), false);
  } finally {
    rmSync(draft, { force: true });
    if (stagedImage) rmSync(path.dirname(stagedImage), { recursive: true, force: true });
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
    assert.match(writeArticle("/../drafts/missing.jpg").errors.join(" "), /must stay within public/);
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

test("glossary candidates filter contractions from the Royal Enfield draft and retain useful riding terms", () => {
  const article = { title: "The Joy of Riding a Royal Enfield in Your 50s", description: "Motorcycle rides and dug dug", tags: ["Royal Enfield"] };
  const candidates = suggestGlossaryTerms(article, "My Classic 350 doesn't need to carry me to an office every morning. The dream doesn't need to become a checklist today. Royal Enfield motorcycle. Royal Enfield motorcycle. The engine goes dug dug, dug dug.", 30);
  assert.ok(candidates.includes("royal enfield"));
  assert.ok(candidates.includes("motorcycle"));
  assert.ok(candidates.includes("dug dug"));
  assert.ok(!candidates.some((term) => /doesn t/.test(term)));
  assert.ok(!candidates.includes("doesn"));
  assert.ok(!candidates.includes("t"));
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

test("publication confirmation preview shows Markdown content and binary asset size", () => {
  const markdown = proposedChangePreview("src/content/writing/example.md", "title: Example\n\nBody text.\n");
  assert.match(markdown, /new file mode/);
  assert.match(markdown, /\+title: Example/);
  assert.match(markdown, /\+Body text\./);
  assert.equal(proposedChangePreview("public/images/example.jpg", Buffer.from([1, 2, 3])), "Binary asset public/images/example.jpg (3 bytes)");
});
