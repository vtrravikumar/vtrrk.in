#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";
import { createServer } from "node:net";
import { stdin, stdout } from "node:process";
import {
  DEFAULT_BANNER,
  DRAFTS_DIR,
  checkImage,
  defaultsFor,
  imagePathFor,
  normalizeTerm,
  parseMarkdown,
  publishedArticleFiles,
  publishSafetyError,
  serializeMarkdown,
  shareIntentUrl,
  slugify,
  stagedPathError,
  suggestGlossaryTerms,
  validateArticle,
} from "./article-core.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const draftRoot = path.join(root, DRAFTS_DIR);
const contentRoot = path.join(root, "src/content/writing");
const glossaryRoot = path.join(root, "src/content/glossary");

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: root, encoding: "utf8", stdio: options.inherit ? "inherit" : "pipe" });
  if (result.error) throw result.error;
  if (result.status !== 0 && !options.allowFailure) {
    throw new Error((result.stderr || result.stdout || `${command} failed`).trim());
  }
  return result;
}

async function availableLocalPort(start = 4321) {
  for (let port = start; port < start + 100; port += 1) {
    const available = await new Promise((resolve, reject) => {
      const server = createServer();
      server.once("error", (error) => error.code === "EADDRINUSE" ? resolve(false) : reject(error));
      server.listen(port, "127.0.0.1", () => server.close(() => resolve(true)));
    });
    if (available) return port;
  }
  throw new Error(`No free local preview port found between ${start} and ${start + 99}.`);
}

function parseOptions(args) {
  const options = {};
  const rest = [];
  for (let i = 0; i < args.length; i += 1) {
    const item = args[i];
    if (item === "--title" || item === "--source" || item === "--banner" || item === "--alt") {
      options[item.slice(2)] = args[++i];
    } else rest.push(item);
  }
  return { options, rest };
}

function ensureDraftRoot() {
  mkdirSync(draftRoot, { recursive: true });
  mkdirSync(path.join(draftRoot, "assets"), { recursive: true });
}

function safeSlug(title) {
  const slug = slugify(title);
  if (!slug) throw new Error("The title needs at least one letter or number to make a filename.");
  return slug;
}

function imageMime(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return extension === ".jpg" || extension === ".jpeg" ? "image/jpeg"
    : extension === ".png" ? "image/png"
    : extension === ".webp" ? "image/webp"
    : extension === ".avif" ? "image/avif" : "application/octet-stream";
}

function copyLocalImage(sourcePath, slug, label, destinationRoot) {
  const check = checkImage(sourcePath);
  if (check.error) throw new Error(check.error);
  const buffer = readFileSync(sourcePath);
  const hash = createHash("sha256").update(buffer).digest("hex").slice(0, 10);
  const extension = path.extname(sourcePath).toLowerCase();
  const name = `${slugify(path.basename(sourcePath, extension)) || label}-${hash}${extension}`;
  const relative = path.join("assets", slug, name);
  const destination = path.join(destinationRoot, relative);
  mkdirSync(path.dirname(destination), { recursive: true });
  if (existsSync(destination)) {
    if (!readFileSync(destination).equals(buffer)) throw new Error(`Refusing to overwrite a different draft asset: ${destination}`);
  } else writeFileSync(destination, buffer, { flag: "wx" });
  return relative.split(path.sep).join("/");
}

function rewriteLocalImages(body, sourcePath, slug, destinationRoot, outputRoot, outputPath) {
  const outputs = [];
  const rewritten = body.replace(/!\[([^\]]*)\]\(([^)\s]+)([^)]*)\)/g, (whole, alt, target, suffix) => {
    if (/^https?:|^\//i.test(target)) return whole;
    if (/^data:/i.test(target)) {
      if (outputRoot === "preview") return whole;
      const data = target.match(/^data:(image\/(?:jpeg|png|webp|avif));base64,([a-z0-9+/=]+)$/i);
      if (!data) throw new Error("Inline image data must use a supported image format.");
      const bytes = Buffer.from(data[2], "base64");
      const format = checkImageBuffer(bytes);
      if (format.error) throw new Error(format.error);
      const extension = format.format === "jpeg" ? ".jpg" : `.${format.format}`;
      const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 10);
      const fileName = `${slug}/${slugify(alt) || "image"}-${hash}${extension}`;
      const destination = path.join(root, "public/images/writing", fileName);
      mkdirSync(path.dirname(destination), { recursive: true });
      if (existsSync(destination) && !readFileSync(destination).equals(bytes)) throw new Error(`Refusing to overwrite an existing image: ${destination}`);
      if (!existsSync(destination)) {
        writeFileSync(destination, bytes, { flag: "wx" });
        outputs.push(path.relative(root, destination));
      }
      return `![${alt}](/images/writing/${fileName}${suffix})`;
    }
    const source = path.resolve(path.dirname(sourcePath), target.split(/[?#]/, 1)[0]);
    const check = checkImage(source);
    if (check.error) throw new Error(check.error);
    if (outputRoot === "preview") {
      const local = copyLocalImage(source, slug, "image", destinationRoot);
      const inline = readFileSync(path.join(destinationRoot, local));
      return `![${alt}](data:${imageMime(local)};base64,${inline.toString("base64")}${suffix})`;
    }
    const checkAgain = checkImage(source);
    if (checkAgain.error) throw new Error(checkAgain.error);
    const relativeName = `${slug}/${slugify(path.basename(source, path.extname(source))) || "image"}-${createHash("sha256").update(readFileSync(source)).digest("hex").slice(0, 10)}${path.extname(source).toLowerCase()}`;
    const destination = path.join(root, "public/images/writing", relativeName);
    mkdirSync(path.dirname(destination), { recursive: true });
    const bytes = readFileSync(source);
    if (existsSync(destination) && !readFileSync(destination).equals(bytes)) throw new Error(`Refusing to overwrite an existing image: ${destination}`);
    if (!existsSync(destination)) {
      writeFileSync(destination, bytes, { flag: "wx" });
      outputs.push(path.relative(root, destination));
    }
    return `![${alt}](/images/writing/${relativeName}${suffix})`;
  });
  return { body: rewritten, outputs };
}

function checkImageBuffer(buffer) {
  const format = buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff ? "jpeg"
    : buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ? "png"
    : buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP" ? "webp"
    : buffer.toString("ascii", 4, 8) === "ftyp" && /^(avif|avis|mif1|msf1)$/.test(buffer.toString("ascii", 8, 12)) ? "avif"
    : undefined;
  if (!format) return { error: "Inline image data is not a supported image." };
  if (buffer.length > 10 * 1024 * 1024) return { error: "Inline image data exceeds the 10 MB limit." };
  return { format };
}

function stageDraft(sourcePath, { bannerPath } = {}) {
  ensureDraftRoot();
  const absolute = path.resolve(sourcePath);
  if (!existsSync(absolute)) throw new Error(`Draft file not found: ${absolute}`);
  const parsed = parseMarkdown(readFileSync(absolute, "utf8"));
  const title = String(parsed.data.title ?? "").trim() || parsed.body.match(/^#\s+(.+)$/m)?.[1]?.trim();
  if (!title) throw new Error("Add a title in frontmatter or a Markdown H1 before staging this draft.");
  const slug = safeSlug(title);
  const destination = path.join(draftRoot, `${slug}.md`);
  const alreadyLocal = absolute.startsWith(`${draftRoot}${path.sep}`);
  if (alreadyLocal) return absolute;
  if (existsSync(destination)) throw new Error(`A local draft already exists at ${destination}; nothing was overwritten.`);

  const data = defaultsFor({ ...parsed.data, title }, parsed.body);
  data.draft = true;
  let body = parsed.body;
  const localBanner = bannerPath ? path.resolve(bannerPath) : data.heroImage && !String(data.heroImage).startsWith("/")
    ? imagePathFor(String(data.heroImage), absolute, root)
    : undefined;
  if (localBanner) {
    if (bannerPath && !data.heroImageAlt) throw new Error("Provide --alt for the informative banner image.");
    data.heroImage = copyLocalImage(localBanner, slug, "banner", draftRoot);
  }
  const inline = rewriteLocalImages(body, absolute, slug, draftRoot, "preview", destination);
  body = inline.body;
  writeFileSync(destination, serializeMarkdown(data, body), { flag: "wx" });
  return destination;
}

function readGlossary() {
  mkdirSync(glossaryRoot, { recursive: true });
  return readdirSync(glossaryRoot).filter((name) => name.endsWith(".md")).map((name) => {
    const file = path.join(glossaryRoot, name);
    const { data } = parseMarkdown(readFileSync(file, "utf8"));
    return { id: name.slice(0, -3), ...data };
  });
}

function existingGlossarySlug(term, glossary) {
  const normalized = normalizeTerm(term);
  const match = glossary.find((entry) => normalizeTerm(entry.term) === normalized
    || (entry.aliases ?? []).some((alias) => normalizeTerm(alias) === normalized));
  return match?.id;
}

function printCheck(result) {
  console.log(`Article: ${result.title || "(no title)"}`);
  console.log(`Slug: ${result.slug || "(unavailable)"}`);
  console.log(`URL: https://vtrrk.in/writing/${result.slug || "<slug>"}/`);
  for (const warning of result.warnings) console.log(`Warning: ${warning}`);
  for (const error of result.errors) console.error(`Error: ${error}`);
  const glossary = readGlossary();
  const candidates = result.candidateGlossaryTerms.map((term) => ({ term, slug: existingGlossarySlug(term, glossary) }));
  if (candidates.length) console.log(`Glossary candidates: ${candidates.map(({ term, slug }) => slug ? `${term} (approved: ${slug})` : term).join(", ")}`);
  return candidates;
}

function printUsage() {
  console.log(`VTRRK article publishing\n\n  npm run article:new -- --title "Article title" [--banner ./image.jpg --alt "Image description"]\n  npm run article:new -- --source ./article.md\n  npm run article:check -- .local/writing-drafts/article-title.md\n  npm run article:preview -- .local/writing-drafts/article-title.md\n  npm run article:publish -- .local/writing-drafts/article-title.md\n  npm run article:list`);
}

function newArticle(options) {
  if (options.source) {
    const staged = stageDraft(options.source, { bannerPath: options.banner });
    console.log(`Draft copied to ${path.relative(root, staged)}`);
    return;
  }
  if (!options.title) throw new Error("Use --title or --source to create a draft.");
  ensureDraftRoot();
  const slug = safeSlug(options.title);
  const file = path.join(draftRoot, `${slug}.md`);
  if (existsSync(file) || publishedArticleFiles(root).includes(slug)) throw new Error(`The filename or article route "${slug}" already exists.`);
  const data = defaultsFor({ title: options.title, description: options.title, draft: true }, "");
  data.draft = true;
  if (options.banner) {
    if (!options.alt) throw new Error("Provide --alt for the informative banner image.");
    data.heroImage = copyLocalImage(path.resolve(options.banner), slug, "banner", draftRoot);
    data.heroImageAlt = options.alt;
  }
  writeFileSync(file, serializeMarkdown(data, "Write your article here.\n"), { flag: "wx" });
  console.log(`Created local-only draft: ${path.relative(root, file)}`);
  console.log("Edit the Markdown file, then run article:check and article:preview.");
}

function listArticles() {
  const published = publishedArticleFiles(root).map((slug) => {
    const { data } = parseMarkdown(readFileSync(path.join(contentRoot, `${slug}.md`), "utf8"));
    return { status: data.draft === true ? "draft in repo" : "published", slug, title: data.title ?? slug, date: data.date ?? "—" };
  });
  const drafts = existsSync(draftRoot) ? readdirSync(draftRoot).filter((name) => name.endsWith(".md")).map((name) => {
    const { data } = parseMarkdown(readFileSync(path.join(draftRoot, name), "utf8"));
    return { status: "local draft", slug: name.slice(0, -3), title: data.title ?? name, date: data.date ?? "—" };
  }) : [];
  for (const item of [...drafts, ...published]) console.log(`${item.status.padEnd(14)} ${String(item.date).padEnd(12)} ${item.slug} — ${item.title}`);
  if (!drafts.length && !published.length) console.log("No articles or local drafts found.");
}

function safetyCheck() {
  const branch = run("git", ["branch", "--show-current"]).stdout.trim();
  if (branch !== "main") throw new Error("Publish only from main. Switch to main after preserving your work.");
  const status = run("git", ["status", "--porcelain"]).stdout.trim();
  if (status) throw new Error(`Working tree is not clean. Commit or move these changes before publishing:\n${status}`);
  const upstream = run("git", ["rev-parse", "--abbrev-ref", "main@{upstream}"]).stdout.trim();
  if (upstream !== "origin/main") throw new Error(`main must track origin/main before publishing (current upstream: ${upstream || "none"}).`);
  run("git", ["fetch", "origin"], { inherit: true });
  const local = run("git", ["rev-parse", "HEAD"]).stdout.trim();
  const remote = run("git", ["rev-parse", "origin/main"]).stdout.trim();
  const error = publishSafetyError({ branch, status, upstream, local, remote });
  if (error) throw new Error(`${error}\nLocal:  ${local}\nRemote: ${remote}\nFast-forward or otherwise reconcile main, then retry.`);
}

async function approveGlossaryTerms(candidates, glossary) {
  if (!candidates.length) return { approved: [], newTerms: [] };
  console.log("\nSuggested glossary terms:");
  candidates.forEach(({ term, slug }, index) => console.log(`  ${index + 1}. ${term}${slug ? " (already approved)" : " (new term)"}`));
  const rl = createInterface({ input: stdin, output: stdout });
  try {
    const answer = await rl.question("Approve terms by number, separated by commas (or press Enter for none): ");
    const selected = new Set(answer.split(",").map((part) => Number(part.trim())).filter((n) => Number.isInteger(n) && n > 0 && n <= candidates.length));
    const approved = [];
    const newTerms = [];
    for (const index of selected) {
      const candidate = candidates[index - 1];
      const existing = candidate.slug ?? existingGlossarySlug(candidate.term, glossary);
      if (existing) { approved.push(existing); continue; }
      const rlDefinition = await rl.question(`Define “${candidate.term}” (leave blank to skip): `);
      if (!rlDefinition.trim()) continue;
      const slug = safeSlug(candidate.term);
      if (glossary.some((entry) => entry.id === slug) || newTerms.some((entry) => entry.slug === slug)) throw new Error(`Glossary slug collision for “${candidate.term}”.`);
      newTerms.push({ slug, term: candidate.term, definition: rlDefinition.trim() });
      approved.push(slug);
    }
    return { approved: [...new Set(approved)], newTerms };
  } finally { rl.close(); }
}

function publishAssets(result, slug, outputs) {
  let heroImage = result.data.heroImage;
  if (heroImage && !heroImage.startsWith("/")) {
    const source = imagePathFor(heroImage, result.sourcePath, root);
    const check = checkImage(source);
    if (check.error) throw new Error(check.error);
    const buffer = readFileSync(source);
    const hash = createHash("sha256").update(buffer).digest("hex").slice(0, 10);
    const extension = path.extname(source).toLowerCase();
    const file = `${slug}-banner-${hash}${extension}`;
    const destination = path.join(root, "public/images/writing", file);
    mkdirSync(path.dirname(destination), { recursive: true });
    if (existsSync(destination) && !readFileSync(destination).equals(buffer)) throw new Error(`Refusing to overwrite image: ${destination}`);
    if (!existsSync(destination)) writeFileSync(destination, buffer, { flag: "wx" });
    outputs.push(path.relative(root, destination));
    heroImage = `/images/writing/${file}`;
  }

  const inline = rewriteLocalImages(result.body, result.sourcePath, slug, draftRoot, "publish", root, undefined);
  outputs.push(...inline.outputs);
  return { heroImage, body: inline.body };
}

function unexpectedChanges(expected) {
  const changed = run("git", ["status", "--porcelain"]).stdout.trim().split("\n").filter(Boolean).map((line) => line.slice(3));
  const unexpected = changed.filter((file) => !expected.includes(file));
  return unexpected;
}

async function verifyLive(url, imageUrl) {
  let last = "The live site has not reflected the publish yet.";
  for (let attempt = 0; attempt < 12; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(8000), cache: "no-store" });
      const html = await response.text();
      const imageResponse = await fetch(imageUrl, { method: "HEAD", signal: AbortSignal.timeout(8000), cache: "no-store" });
      const deployed = response.ok
        && html.includes(`content="${imageUrl}"`)
        && html.includes("name=\"twitter:image\"")
        && imageResponse.ok
        && (imageResponse.headers.get("content-type") ?? "").startsWith("image/");
      if (deployed) return { ok: true, status: response.status };
      last = `Article status ${response.status}; banner content-type ${imageResponse.headers.get("content-type") ?? "unknown"}.`;
    } catch (error) { last = error.message; }
    if (attempt < 11) await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  return { ok: false, message: last };
}

async function publish(sourcePath) {
  safetyCheck();
  const stagedDraft = stageDraft(sourcePath);
  const result = validateArticle(stagedDraft, root, { publishing: true });
  const candidates = printCheck(result);
  if (result.errors.length) throw new Error("Fix the article validation errors before publishing.");

  const glossary = readGlossary();
  const { approved, newTerms } = await approveGlossaryTerms(candidates, glossary);
  const currentTerms = Array.isArray(result.data.glossaryTerms) ? result.data.glossaryTerms : [];
  const allTerms = [...new Set([...currentTerms, ...approved])];
  const allKnown = new Set([...glossary.map((entry) => entry.id), ...newTerms.map((entry) => entry.slug)]);
  const unknown = allTerms.filter((term) => !allKnown.has(term));
  if (unknown.length) throw new Error(`Unknown glossary term slug(s): ${unknown.join(", ")}. Approve or correct them before publishing.`);

  const generated = [];
  const assets = publishAssets({ ...result, sourcePath: stagedDraft }, result.slug, generated);
  const data = defaultsFor({ ...result.data, title: result.title, heroImage: assets.heroImage, glossaryTerms: allTerms }, assets.body);
  delete data.candidateGlossaryTerms;
  data.draft = false;
  const articleFile = path.join(contentRoot, `${result.slug}.md`);
  if (existsSync(articleFile)) throw new Error(`Refusing to overwrite existing article: ${articleFile}`);

  const created = [...generated];
  for (const entry of newTerms) {
    const file = path.join(glossaryRoot, `${entry.slug}.md`);
    if (existsSync(file)) throw new Error(`Refusing to overwrite glossary term: ${file}`);
    writeFileSync(file, serializeMarkdown(entry, ""), { flag: "wx" });
    created.push(path.relative(root, file));
  }
  writeFileSync(articleFile, serializeMarkdown(data, assets.body), { flag: "wx" });
  created.push(path.relative(root, articleFile));

  const articleUrl = `https://vtrrk.in/writing/${result.slug}/`;
  const imageUrl = new URL(assets.heroImage ?? DEFAULT_BANNER, "https://vtrrk.in").toString();
  console.log("\nPublishing summary");
  console.log(`  Title: ${data.title}`);
  console.log(`  URL: ${articleUrl}`);
  console.log(`  Date: ${data.date}`);
  console.log(`  Banner: ${assets.heroImage ?? `${DEFAULT_BANNER} (shared default)`}`);
  console.log(`  Approved glossary: ${allTerms.length ? allTerms.join(", ") : "none"}`);
  console.log("  Files:");
  for (const file of [...new Set(created)].sort()) console.log(`    ${file}`);

  let filesStaged = false;
  try {
    run("npm", ["test"], { inherit: true });
    run("npm", ["run", "build"], { inherit: true });
    const unexpected = unexpectedChanges([...new Set(created)]);
    if (unexpected.length) throw new Error(`Unexpected changed files detected; nothing will be staged:\n${unexpected.join("\n")}`);
    const rl = createInterface({ input: stdin, output: stdout });
    let answer;
    try { answer = await rl.question("Commit and push exactly these files to origin/main? [y/N] "); } finally { rl.close(); }
    if (!/^y(es)?$/i.test(answer.trim())) {
      for (const file of created) rmSync(path.join(root, file), { force: true });
      console.log("Publication cancelled. The local draft remains in the private draft folder.");
      return;
    }
    const files = [...new Set(created)];
    filesStaged = true;
    run("git", ["add", "--", ...files], { inherit: true });
    const staged = run("git", ["diff", "--cached", "--name-only"]).stdout.trim().split("\n").filter(Boolean);
    const stagingError = stagedPathError(staged, files);
    if (stagingError) throw new Error(`${stagingError}; refusing to commit.`);
    run("git", ["commit", "-m", `Publish article: ${data.title}`], { inherit: true });
    run("git", ["fetch", "origin"], { inherit: true });
    const parent = run("git", ["rev-parse", "HEAD^"]).stdout.trim();
    const remoteBeforePush = run("git", ["rev-parse", "origin/main"]).stdout.trim();
    if (parent !== remoteBeforePush) throw new Error(`The remote changed while the article was being prepared. Commit is safe locally, but was not pushed.\nCommit parent: ${parent}\norigin/main: ${remoteBeforePush}`);
    run("git", ["push", "origin", "main"], { inherit: true });
    const remoteAfterPush = run("git", ["ls-remote", "origin", "refs/heads/main"]).stdout.trim().split(/\s+/)[0];
    const commit = run("git", ["rev-parse", "HEAD"]).stdout.trim();
    if (remoteAfterPush !== commit) throw new Error(`Push verification failed: local commit ${commit}, remote main ${remoteAfterPush || "unavailable"}.`);
    const archiveDirectory = path.join(draftRoot, "published");
    mkdirSync(archiveDirectory, { recursive: true });
    const archivePath = path.join(archiveDirectory, `${result.slug}.md`);
    if (!existsSync(archivePath)) renameSync(stagedDraft, archivePath);
    console.log(`\nPushed ${commit} to origin/main.`);
    console.log("Checking deployment at the public article and banner URLs (up to 60 seconds)…");
    const deployed = await verifyLive(articleUrl, imageUrl);
    if (deployed.ok) console.log("Deployment verified: the live article and image are serving the new metadata and an image content type.");
    else console.log(`Deployment is not verified yet: ${deployed.message}`);
  } catch (error) {
    if (!filesStaged) {
      // These exact output files did not exist before this publishing attempt.
      for (const file of created) rmSync(path.join(root, file), { force: true });
    }
    throw error;
  }
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  const { options, rest } = parseOptions(args);
  if (!command || command === "help" || command === "--help") { printUsage(); return; }
  if (command === "new") { newArticle(options); return; }
  if (command === "list") { listArticles(); return; }
  if (command === "check") {
    const file = rest[0];
    if (!file) throw new Error("Provide a Markdown draft path.");
    const result = validateArticle(path.resolve(file), root);
    printCheck(result);
    if (result.errors.length) process.exitCode = 1;
    return;
  }
  if (command === "preview") {
    const file = rest[0];
    if (!file) throw new Error("Provide a Markdown draft path.");
    const staged = stageDraft(file);
    const result = validateArticle(staged, root);
    printCheck(result);
    if (result.errors.length) throw new Error("Fix the validation errors before previewing.");
    const port = await availableLocalPort();
    run("node_modules/.bin/astro", ["dev", "--background", "--host", "127.0.0.1", "--port", String(port)], { inherit: true });
    console.log(`Preview: http://127.0.0.1:${port}/writing/preview/${path.basename(staged, ".md")}/`);
    console.log("Stop the preview server with: npx astro dev stop");
    return;
  }
  if (command === "publish") {
    const file = rest[0];
    if (!file) throw new Error("Provide a Markdown draft path.");
    await publish(file);
    return;
  }
  throw new Error(`Unknown article command: ${command}`);
}

main().catch((error) => {
  console.error(`\nArticle publishing stopped: ${error.message}`);
  process.exitCode = 1;
});
