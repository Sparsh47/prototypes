// Seeds any URL shortener that follows the contract, using only its HTTP API.
// Usage: node seed-api.mjs [baseUrl] [count] [concurrency]
// Writes codes.json (list of real codes) which the k6 scripts read.
import fs from "node:fs";

const base = process.argv[2] || "http://localhost:3000";
const total = parseInt(process.argv[3] || "10000", 10);
const conc = parseInt(process.argv[4] || "20", 10);

const codes = [];
let sent = 0, failed = 0;
const t0 = Date.now();

async function worker() {
  while (sent < total) {
    const i = sent++;
    try {
      const r = await fetch(`${base}/api/shorten`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: `https://example.com/page/${i}-${Math.random().toString(36).slice(2, 10)}` }),
      });
      if (!r.ok) { failed++; continue; }
      const j = await r.json();
      const code = j.code || (j.short || "").split("/").pop();
      if (code) codes.push(code); else failed++;
    } catch { failed++; }
    if (i % 1000 === 0 && i) console.log(`${i}/${total}  ${(i / ((Date.now() - t0) / 1000)).toFixed(0)} req/s`);
  }
}

await Promise.all(Array.from({ length: conc }, worker));
fs.writeFileSync("codes.json", JSON.stringify(codes));
const secs = (Date.now() - t0) / 1000;
console.log(`done: ${codes.length} ok, ${failed} failed, ${secs.toFixed(1)}s, ${(codes.length / secs).toFixed(0)} creates/s`);
console.log(`unique codes: ${new Set(codes).size} (duplicates mean collisions!)`);
