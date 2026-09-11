#!/usr/bin/env node

import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_RAW = "https://raw.githubusercontent.com/vtrravikumar/vtrrk-photography/main";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "photography");
const CATALOG_URL = `${REPO_RAW}/catalog/photos.yaml`;

function stripYamlQuotes(value) {
  return value.replace(/^(["'])(.*)\1$/, "$2");
}

function extractEntries(yaml) {
  const blocks = yaml.split(/^  - id:\s*/m).slice(1);

  return blocks.map((block) => {
    const id = stripYamlQuotes(block.split("\n", 1)[0].trim());
    const file = stripYamlQuotes(block.match(/^    file:\s*(.+)$/m)?.[1]?.trim() ?? "");
    const thumbnail = stripYamlQuotes(block.match(/^    thumbnail:\s*(.+)$/m)?.[1]?.trim() ?? "");
    const country = stripYamlQuotes(block.match(/^    country:\s*(.+)$/m)?.[1]?.trim() ?? "");
    const place = stripYamlQuotes(block.match(/^    place:\s*(.+)$/m)?.[1]?.trim() ?? "");
    const title = stripYamlQuotes(block.match(/^    title:\s*(.+)$/m)?.[1]?.trim() ?? "");
    const width = Number(block.match(/^    width:\s*(\d+)$/m)?.[1] ?? 0);
    const height = Number(block.match(/^    height:\s*(\d+)$/m)?.[1] ?? 0);
    const published = block.match(/^    published:\s*(true|false)$/m)?.[1] === "true";
    const categoriesMatch = block.match(/^    categories:\s*\[(.*)\]$/m)?.[1];
    const categories = categoriesMatch
      ? categoriesMatch.split(",").map((value) => stripYamlQuotes(value.trim())).filter(Boolean)
      : country ? ["countries"] : [];

    if (!id || !file || !thumbnail || !country || !place || !title || !width || !height || !published || !categories.length) return null;
    return { id, file, thumbnail, country, place, title, width, height, categories, published };
  }).filter(Boolean);
}

function safeRelativePath(value) {
  const cleaned = value.replaceAll("\\", "/");
  const normalized = normalize(cleaned).replaceAll("\\", "/");
  if (normalized.startsWith("../") || normalized === ".." || normalized.startsWith("/")) {
    throw new Error(`Unsafe photography path: ${value}`);
  }
  return normalized;
}

async function download(url, destination) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: HTTP ${response.status}`);
  }
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
}

const response = await fetch(CATALOG_URL);
if (!response.ok) {
  throw new Error(`Failed to fetch photography catalog: HTTP ${response.status}`);
}

const catalogYaml = await response.text();
const entries = extractEntries(catalogYaml);

if (!entries.length) {
  throw new Error("Photography catalog contains no published photographs.");
}

await rm(ROOT, { recursive: true, force: true });
await mkdir(ROOT, { recursive: true });

const catalog = [];
for (const entry of entries) {
  const file = safeRelativePath(entry.file);
  const thumbnail = safeRelativePath(entry.thumbnail);

  await download(`${REPO_RAW}/published/${file}`, join(ROOT, file));
  await download(`${REPO_RAW}/published/${thumbnail}`, join(ROOT, thumbnail));

  catalog.push(entry);
}

await writeFile(join(ROOT, "catalog.json"), `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Synced ${catalog.length} photograph(s) from vtrrk-photography.`);
