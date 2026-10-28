import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";

const page = await readFile(new URL("../src/pages/vichar.astro", import.meta.url), "utf8");

test("Vichar web generator offers English, Hindi, and Tamil", () => {
  assert.match(page, /<select id="language" name="language">/);
  assert.match(page, /<option value="en" selected>English<\/option>/);
  assert.match(page, /<option value="hi">Hindi — हिन्दी<\/option>/);
  assert.match(page, /<option value="ta">Tamil — தமிழ்<\/option>/);
});

test("Vichar web generator sends the selected language to the existing API", () => {
  assert.match(page, /language: language\.value/);
  assert.match(page, /tweet\.lang = language\.value;/);
});

test("Vichar web generator uses V2 so the selected random style is returned", () => {
  assert.match(page, /const API_URL = "https:\/\/api\.vtrrk\.in\/vichar\/v2\/tweet\/generate";/);
  assert.match(page, /style: pickRandomStyle\(\)/);
  assert.match(page, /typeof payload\.style === "string" && payload\.style\.trim\(\)/);
});

test("Vichar identifies the web generator as multilingual and news-aware", () => {
  assert.match(page, /Multilingual · News-aware · \{vicharVersion\}/);
});

const changelog = await readFile(new URL("../src/pages/vichar/changelog.astro", import.meta.url), "utf8");

test("Vichar footer links to a public version history page", () => {
  assert.match(page, /href="\/vichar\/changelog\/">Version history<\/a>/);
  assert.match(changelog, /title="Vichar Version History — By VTRRK"/);
  assert.match(changelog, /v4\.1/);
  assert.match(changelog, /v4\.0/);
  assert.match(changelog, /English, Hindi, or Tamil/);
  assert.match(changelog, /News-aware Vichar/);
});


test("Vichar creation highlights the generated result and brings it into view", () => {
  assert.match(page, /resultWrap\.classList\.add\("result-ready"\)/);
  assert.match(page, /resultWrap\.scrollIntoView\(/);
  assert.match(page, /prefers-reduced-motion: reduce/);
  assert.match(page, /\.result-wrap\.result-ready/);
  assert.match(page, /@keyframes result-attention/);
});

test("Vichar topic and language selectors share a responsive row", () => {
  assert.match(page, /class="topic-language-row"/);
  assert.match(page, /grid-template-columns:minmax\(0,1\.1fr\) minmax\(0,\.9fr\)/);
  assert.match(page, /\.field-row,\.topic-language-row\{grid-template-columns:1fr\}/);
});
