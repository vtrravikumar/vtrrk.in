interface Env {
  TRAVELOGUE_DB: D1Database;
  TRAVELOGUE_PDF: R2Bucket;
}

const PDF_KEY = "travelogue/travelogue.pdf";
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

function redirectToError(request: Request, error: string) {
  const url = new URL("/books/travelogue/", request.url);
  url.searchParams.set("error", error);
  return Response.redirect(url.toString(), 303);
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const form = await request.formData();
  const submittedCode = form.get("code");

  if (typeof submittedCode !== "string") {
    return redirectToError(request, "invalid");
  }

  const code = normalizeCode(submittedCode);
  if (!CODE_PATTERN.test(code)) {
    return redirectToError(request, "invalid");
  }

  const object = await env.TRAVELOGUE_PDF.get(PDF_KEY);
  if (!object) {
    return new Response("Travelogue download is temporarily unavailable.", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const codeHash = await sha256(code);
  const redeemedAt = new Date().toISOString();

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
    return redirectToError(request, "invalid");
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Content-Type", "application/pdf");
  headers.set("Content-Disposition", 'attachment; filename="VTRRK-Travelogue.pdf"');
  headers.set("Cache-Control", "no-store, private");
  headers.set("X-Content-Type-Options", "nosniff");

  return new Response(object.body, { headers });
};
