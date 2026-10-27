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
  assert.match(page, /tweet\.lang = language\.value === "hi" \? "hi" : language\.value === "ta" \? "ta" : "en"/);
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
