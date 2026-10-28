const CREATE_IDEAS_LABELS = Object.freeze({
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
});

export function getCreateIdeasLabel(language) {
  return CREATE_IDEAS_LABELS[language] ?? CREATE_IDEAS_LABELS.en;
}
