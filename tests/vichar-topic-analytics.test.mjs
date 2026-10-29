import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("Vichar marks custom topics without changing the generation endpoint", async () => {
  const page = await read("../src/pages/vichar.astro");
  assert.match(page, /https:\/\/api\.vtrrk\.in\/vichar\/v2\/tweet\/generate/);
  assert.match(page, /topicSource: topic\.value === "__custom__" \? "custom" : "preset"/);
  assert.match(page, /topic: selectedTopic/);
  assert.match(page, /language: language\.value/);
  assert.match(page, /useNews: useNews\.checked/);
  assert.match(page, /Please avoid entering personal or sensitive information in your topic/);
});

test("Vichar 4.1.4 keeps the visible V4.1 label and documents topic analytics", async () => {
  const pkg = JSON.parse(await read("../package.json"));
  const lock = JSON.parse(await read("../package-lock.json"));
  const changelog = await read("../src/pages/vichar/changelog.astro");
  const privacy = await read("../src/pages/vichar/privacy.astro");

  assert.equal(pkg.version, "4.1.4");
  assert.equal(lock.version, "4.1.4");
  assert.match(changelog, /<h2>v4\.1\.4<\/h2>/);
  assert.match(changelog, /visible V4\.1 capability label/);
  assert.match(privacy, /selected output language may be recorded for product analysis/);
  assert.match(privacy, /90 days/);
  assert.match(privacy, /not used for advertising or model training/);
});
