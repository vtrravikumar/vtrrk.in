import test from "node:test";
import assert from "node:assert/strict";
import { getCreateIdeasLabel } from "../src/utils/vichar-language-labels.js";

test("returns a translated create button label for every supported Vichar language", () => {
  const expected = {
    en: "Create ideas",
    hi: "विचार बनाएँ",
    ta: "யோசனைகளை உருவாக்கு",
    es: "Crear ideas",
    "pt-BR": "Criar ideias",
    ja: "アイデアを作成",
    id: "Buat ide",
    ar: "أنشئ أفكارًا",
    fr: "Créer des idées",
    tr: "Fikir oluştur",
    ko: "아이디어 만들기",
    de: "Ideen erstellen",
  };

  for (const [language, label] of Object.entries(expected)) {
    assert.equal(getCreateIdeasLabel(language), label, language);
  }
});

test("falls back to English for an unknown or missing language", () => {
  assert.equal(getCreateIdeasLabel("xx"), "Create ideas");
  assert.equal(getCreateIdeasLabel(undefined), "Create ideas");
});
