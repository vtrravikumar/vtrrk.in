import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import { shareIntentUrl } from "../src/utils/share-intent.mjs";

export const DRAFTS_DIR = ".local/writing-drafts";
export const DEFAULT_BANNER = "/images/travel/default.jpg";
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const SHARE_TEXT_LIMIT = 200;

export function publishSafetyError({ branch, status, upstream, local, remote }) {
  if (branch !== "main") return "Publish only from main.";
  if (status) return "Working tree is not clean.";
  if (upstream !== "origin/main") return "main must track origin/main.";
  if (local !== remote) return "main is not synchronized with origin/main.";
  return undefined;
}

export function stagedPathError(staged, intended) {
  const expected = new Set(intended);
  const unexpected = staged.filter((file) => !expected.has(file));
  const missing = intended.filter((file) => !staged.includes(file));
  if (unexpected.length) return `Unexpected staged file: ${unexpected[0]}`;
  if (missing.length) return `Expected file was not staged: ${missing[0]}`;
  return undefined;
}

const stopWords = new Set((
  "a an and are as at be been but by can for from had has have he her here hers him his how i if in into is it its me more most my no not of on or our out she so than that the their them then there these they this to too us was we were what when where which who will with you your"
).split(" "));

export function slugify(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeTerm(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLocaleLowerCase("en")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function parseMarkdown(source) {
  const match = String(source).match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/);
  if (!match) throw new Error("Markdown must start with YAML frontmatter delimited by --- lines.");
  const data = parseYaml(match[1]) ?? {};
  if (!data || Array.isArray(data) || typeof data !== "object") throw new Error("Frontmatter must be a YAML mapping.");
  return { data, body: source.slice(match[0].length) };
}

export function serializeMarkdown(data, body) {
  return `---\n${stringifyYaml(data, { lineWidth: 0 }).trimEnd()}\n---\n\n${String(body).trimStart()}`;
}

export function stripMarkdown(value) {
  return String(value ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[`*_>#~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function descriptionFromBody(body, title = "") {
  const paragraph = String(body ?? "")
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .find((part) => part && !/^(#{1,6}\s|[-*+]\s|\d+\.\s|>\s|```)/.test(part));
  const text = stripMarkdown(paragraph ?? title);
  if (text.length <= 160) return text;
  const clipped = text.slice(0, 157).replace(/\s+\S*$/, "").trimEnd();
  return `${clipped}…`;
}

export function defaultsFor(data, body, now = new Date()) {
  const title = String(data.title ?? "").trim();
  const date = data.date instanceof Date ? localDate(data.date) : String(data.date ?? localDate(now)).slice(0, 10);
  return {
    ...data,
    title,
    description: String(data.description ?? "").trim() || descriptionFromBody(body, title),
    date,
    createdAt: data.createdAt ?? localDate(now),
    updatedAt: data.updatedAt ?? localDate(now),
    type: String(data.type ?? "Essay").trim() || "Essay",
    tags: Array.isArray(data.tags) ? data.tags : [],
    glossaryTerms: Array.isArray(data.glossaryTerms) ? data.glossaryTerms : [],
    draft: false,
  };
}

function words(value) {
  return String(value ?? "").toLocaleLowerCase("en").match(/[\p{L}][\p{L}\p{N}'’-]*/gu) ?? [];
}

export function suggestGlossaryTerms(article, body, limit = 8) {
  const weighted = new Map();
  const add = (term, weight) => {
    const normalized = normalizeTerm(term);
    if (!normalized || normalized.split(" ").every((word) => stopWords.has(word))) return;
    weighted.set(normalized, (weighted.get(normalized) ?? 0) + weight);
  };

  const headings = [article.title, article.subtitle, article.description, ...(article.tags ?? [])].filter(Boolean);
  for (const heading of headings) {
    const tokens = words(heading).filter((word) => !stopWords.has(word));
    for (const token of tokens) add(token, 2);
    for (let size = 2; size <= 3; size += 1) {
      for (let i = 0; i <= tokens.length - size; i += 1) add(tokens.slice(i, i + size).join(" "), 4);
    }
  }

  const bodyWords = words(stripMarkdown(body)).filter((word) => !stopWords.has(word));
  const bodyCounts = new Map();
  for (const token of bodyWords) bodyCounts.set(token, (bodyCounts.get(token) ?? 0) + 1);
  for (const [token, count] of bodyCounts) if (count >= 3) add(token, count);
  for (let size = 2; size <= 3; size += 1) {
    const counts = new Map();
    for (let i = 0; i <= bodyWords.length - size; i += 1) {
      const phrase = bodyWords.slice(i, i + size).join(" ");
      counts.set(phrase, (counts.get(phrase) ?? 0) + 1);
    }
    for (const [phrase, count] of counts) if (count >= 2) add(phrase, count * 2);
  }

  return [...weighted.entries()]
    .filter(([term]) => term.length > 2 && !/^\d+$/.test(term))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([term]) => term);
}

export function imageFormat(buffer) {
  if (buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "jpeg";
  if (buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return "png";
  if (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return "webp";
  if (buffer.toString("ascii", 4, 8) === "ftyp" && /^(avif|avis|mif1|msf1)$/.test(buffer.toString("ascii", 8, 12))) return "avif";
  return undefined;
}

export function checkImage(filePath) {
  if (!existsSync(filePath) || !statSync(filePath).isFile()) return { error: `Image does not exist: ${filePath}` };
  const buffer = readFileSync(filePath);
  if (buffer.length > MAX_IMAGE_BYTES) return { error: `Image is ${Math.ceil(buffer.length / 1024 / 1024)} MB; the limit is 10 MB.` };
  const format = imageFormat(buffer);
  if (!format) return { error: `Unsupported or invalid image format: ${filePath}` };
  const extension = path.extname(filePath).toLowerCase().replace(".jpg", ".jpeg");
  if (!extension.endsWith(`.${format}`)) return { error: `Image extension does not match its ${format.toUpperCase()} contents: ${filePath}` };
  return { format, bytes: buffer.length };
}

export function imagePathFor(value, sourcePath, root) {
  if (!value) return undefined;
  if (value.startsWith("/")) return path.resolve(root, "public", `.${value}`);
  return path.resolve(path.dirname(sourcePath), value);
}

function validDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) return false;
  return typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)
    || date.toISOString().slice(0, 10) === value;
}

export function publishedArticleFiles(root) {
  const directory = path.join(root, "src/content/writing");
  const collect = (current, prefix = "") => readdirSync(current, { withFileTypes: true }).flatMap((entry) => {
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) return collect(path.join(current, entry.name), relative);
    return entry.isFile() && entry.name.endsWith(".md") ? [relative.slice(0, -3)] : [];
  });
  return collect(directory);
}

function routeExists(root, target) {
  const clean = decodeURIComponent(target.split(/[?#]/, 1)[0]).replace(/^\/+|\/+$/g, "");
  if (!clean) return existsSync(path.join(root, "src/pages/index.astro"));
  if (clean.startsWith("images/") || clean.startsWith("photography/")) return existsSync(path.join(root, "public", clean));
  if (clean.startsWith("writing/")) return publishedArticleFiles(root).includes(clean.slice("writing/".length));
  return [
    path.join(root, "src/pages", `${clean}.astro`),
    path.join(root, "src/pages", clean, "index.astro"),
  ].some(existsSync);
}

export function validateArticle(sourcePath, root, { publishing = false } = {}) {
  const source = readFileSync(sourcePath, "utf8");
  const errors = [];
  const warnings = [];
  let parsed;
  try { parsed = parseMarkdown(source); } catch (error) { return { errors: [error.message], warnings, source }; }
  const { data, body } = parsed;
  const title = String(data.title ?? "").trim() || stripMarkdown(body.split("\n").find((line) => /^#\s+/.test(line))?.replace(/^#\s+/, ""));
  if (!title) errors.push("Add a title in frontmatter or a single Markdown H1.");
  if (!stripMarkdown(body)) errors.push("The article body is empty.");
  if (data.description && String(data.description).length > 300) warnings.push("Description exceeds 300 characters; consider a shorter search snippet.");
  if (data.date !== undefined && !validDate(data.date)) errors.push("Publication date must be a valid date.");
  if (data.createdAt !== undefined && !validDate(data.createdAt)) errors.push("createdAt must be a valid date.");
  if (data.updatedAt !== undefined && !validDate(data.updatedAt)) errors.push("updatedAt must be a valid date.");
  if (data.tags !== undefined && (!Array.isArray(data.tags) || data.tags.some((tag) => typeof tag !== "string"))) errors.push("tags must be a list of strings.");
  if (data.glossaryTerms !== undefined && (!Array.isArray(data.glossaryTerms) || data.glossaryTerms.some((term) => typeof term !== "string"))) errors.push("glossaryTerms must be a list of approved glossary slugs.");

  const slug = slugify(title);
  if (!slug) errors.push("Title does not produce a usable URL slug.");
  if (slug && publishedArticleFiles(root).includes(slug) && path.resolve(sourcePath) !== path.join(root, `src/content/writing/${slug}.md`)) errors.push(`An article already uses slug "${slug}"; rename the title or use the existing article.`);
  if (slug) {
    const flatRoute = path.join(root, `src/pages/writing/${slug}.astro`);
    const nestedRoute = path.join(root, `src/pages/writing/${slug}/index.astro`);
    if (existsSync(flatRoute) || existsSync(nestedRoute)) errors.push(`The generated route would conflict with an existing Astro route for "${slug}".`);
  }

  let bannerPath;
  if (data.heroImage) {
    bannerPath = imagePathFor(String(data.heroImage), sourcePath, root);
    const image = checkImage(bannerPath);
    if (image.error) errors.push(image.error);
    if (!String(data.heroImageAlt ?? "").trim()) errors.push("Add heroImageAlt for the informative article banner.");
  }

  for (const match of body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)) {
    const [, alt, target] = match;
    if (!alt.trim()) errors.push(`Informative inline image needs alt text: ${target}`);
    if (/^data:/i.test(target)) {
      const data = target.match(/^data:(image\/(?:jpeg|png|webp|avif));base64,([a-z0-9+/=]+)$/i);
      if (!data) errors.push("Inline image data must use a supported image format.");
      else {
        const buffer = Buffer.from(data[2], "base64");
        if (buffer.length > MAX_IMAGE_BYTES || imageFormat(buffer) !== data[1].split("/")[1]) errors.push("Inline image data is oversized or does not match its declared format.");
      }
    } else if (!/^(?:https?:|\/)/i.test(target)) {
      const file = path.resolve(path.dirname(sourcePath), target.split(/[?#]/, 1)[0]);
      const image = checkImage(file);
      if (image.error) errors.push(image.error);
    } else if (target.startsWith("/") && !existsSync(path.join(root, "public", `.${target.split(/[?#]/, 1)[0]}`))) {
      errors.push(`Local image does not exist in public/: ${target}`);
    }
  }
  for (const match of body.matchAll(/(?<!!)\[[^\]]+\]\(([^)]+)\)/g)) {
    const target = match[1].trim().replace(/^<|>$/g, "").split(/[?#]/, 1)[0];
    if (!target || /^(?:https?:|mailto:|tel:|#)/i.test(target)) continue;
    if (target.startsWith("/")) {
      if (!routeExists(root, target)) warnings.push(`Local link may not resolve: ${target}`);
    } else if (!existsSync(path.resolve(path.dirname(sourcePath), target))) {
      warnings.push(`Relative link may not resolve: ${target}`);
    }
  }

  if (!data.description) warnings.push("Description will be derived from the opening paragraph.");
  if (!data.date) warnings.push("Publication date will default to today when published.");
  if (!data.heroImage) warnings.push(`No custom banner; the shared default ${DEFAULT_BANNER} will be used.`);
  const normalized = defaultsFor({ ...data, title }, body);
  const candidateGlossaryTerms = suggestGlossaryTerms(normalized, body);
  if (publishing && data.draft === true) warnings.push("This draft is marked draft:true; the publisher will clear this flag on the published copy.");
  return { data, body, title, slug, bannerPath, normalized, candidateGlossaryTerms, errors, warnings, source };
}

export { shareIntentUrl };
