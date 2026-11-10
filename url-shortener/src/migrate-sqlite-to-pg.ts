import 'dotenv/config';
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import type { Contract } from './prisma/contract.d.ts';
import contractJson from './prisma/contract.json' with { type: 'json' };

const BATCH_SIZE = 500;
const DB_PATH = path.resolve(import.meta.dirname, '..', 'links.db');

const sqlite = new DatabaseSync(DB_PATH, { readOnly: true });
const contract = contractFromJson<Contract>(contractJson);
const db = postgres({
  contract,
  url: process.env['DIRECT_URL']!,
});

const { c: totalCount } = sqlite.prepare('SELECT COUNT(*) as c FROM links').get() as { c: number };
console.log(`Migrating ${totalCount.toLocaleString()} rows in batches of ${BATCH_SIZE}...`);

const selectStmt = sqlite.prepare(
  'SELECT code, url, created_at FROM links ORDER BY rowid LIMIT ? OFFSET ?'
);

let offset = 0;
let migrated = 0;
const start = Date.now();

while (offset < totalCount) {
  const rows = selectStmt.all(BATCH_SIZE, offset) as Array<{
    code: string;
    url: string;
    created_at: string;
  }>;

  if (rows.length === 0) break;

  // Bulk insert via SQL builder
  const plan = db.sql.public.links
    .insert(
      rows.map((r) => ({
        code: r.code,
        url: r.url,
        created_at: new Date(r.created_at.endsWith('Z') ? r.created_at : r.created_at + 'Z'),
      }))
    )
    .build();

  await db.execute(plan);

  offset += rows.length;
  migrated += rows.length;

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  const pct = ((migrated / totalCount) * 100).toFixed(1);
  const rps = (migrated / ((Date.now() - start) / 1000)).toFixed(0);
  console.log(`  ${migrated.toLocaleString()} / ${totalCount.toLocaleString()} (${pct}%) — ${elapsed}s elapsed, ~${rps} rows/s`);
}

await db.close();
sqlite.close();

const totalSecs = ((Date.now() - start) / 1000).toFixed(1);
console.log(`\n✅ Done! Migrated ${migrated.toLocaleString()} rows in ${totalSecs}s`);

