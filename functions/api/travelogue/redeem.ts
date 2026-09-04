interface Env {
  TRAVELOGUE_DB: D1Database;
}

const PDF_PATH = "/books/travelogue/travelogue.pdf";
const CODE_PATTERN = /^TRV-[A-Z2-7]{4}(?:-[A-Z2-7]{4}){3}$/;

function normalizeCode(value: string) {
  return value.trim().toUpperCase();
}

async function sha256(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function redirectToError(request: Request) {
  const url = new URL("/books/travelogue/", request.url);
  url.searchParams.set("error", "invalid");
  return Response.redirect(url.toString(), 303);
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const form = await request.formData();
  const submittedCode = form.get("code");

  if (typeof submittedCode !== "string") {
    return redirectToError(request);
  }

  const code = normalizeCode(submittedCode);
  if (!CODE_PATTERN.test(code)) {
    return redirectToError(request);
  }

  const codeHash = await sha256(code);
  const redeemedAt = new Date().toISOString();

  // The conditional UPDATE is atomic in D1, so a valid code can only win once.
  const result = await env.TRAVELOGUE_DB
    .prepare(
      `UPDATE download_codes
       SET redeemed_at = ?
       WHERE code_hash = ?
         AND redeemed_at IS NULL
         AND expires_at > datetime('now')`,
    )
    .bind(redeemedAt, codeHash)
    .run();

  if (!result.meta.changes) {
    return redirectToError(request);
  }

  const downloadUrl = new URL(PDF_PATH, request.url);
  return Response.redirect(downloadUrl.toString(), 303);
};
