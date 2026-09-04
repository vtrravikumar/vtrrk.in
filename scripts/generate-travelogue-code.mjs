import { createHash, randomBytes } from "node:crypto";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const groups = 4;
const groupLength = 4;
const expiryDays = Number(process.argv[2] ?? 7);

if (!Number.isInteger(expiryDays) || expiryDays < 1 || expiryDays > 365) {
  console.error("Usage: node scripts/generate-travelogue-code.mjs [expiry-days]");
  process.exit(1);
}

function randomCode() {
  const bytes = randomBytes(groups * groupLength);
  let code = "";

  for (const byte of bytes) {
    code += alphabet[byte % alphabet.length];
  }

  return `TRV-${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8, 12)}-${code.slice(12, 16)}`;
}

const code = randomCode();
const hash = createHash("sha256").update(code).digest("hex");

console.log(`Code: ${code}`);
console.log(`Expires: ${expiryDays} days from insertion`);
console.log("\nPaste this statement into the D1 SQL console:\n");
console.log(
  `INSERT INTO download_codes (code_hash, expires_at) VALUES ('${hash}', datetime('now', '+${expiryDays} days'));`,
);
