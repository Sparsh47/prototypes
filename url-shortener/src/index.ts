import crypto from 'node:crypto';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import express from 'express';

const PORT = 3000;
const DB_PATH = path.resolve(import.meta.dirname, '..', 'links.db');
const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

interface LinkRow {
  code: string;
  url: string;
  created_at: string;
}

const db = new DatabaseSync(DB_PATH);
db.exec(`
  CREATE TABLE IF NOT EXISTS links (
    code TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

function generateCode(length = 6): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += ALPHABET.charAt(crypto.randomInt(ALPHABET.length));
  }
  return code;
}

const app = express();
app.use(express.json());

app.post('/api/shorten', (req, res) => {
  const url = typeof req.body?.url === 'string' ? req.body.url.trim() : '';
  if (!url) {
    res.status(400).json({ error: 'url is required' });
    return;
  }

  const code = generateCode();
  db.prepare('INSERT INTO links (code, url) VALUES (?, ?)').run(code, url);

  res.status(200).json({
    code,
    short: `http://localhost:${PORT}/${code}`,
  });
});

app.get('/api/links', (_req, res) => {
  const rows = db
    .prepare('SELECT code, url, created_at FROM links ORDER BY rowid DESC')
    .all() as unknown as LinkRow[];

  res.json(
    rows.map((row) => ({
      code: row.code,
      url: row.url,
      short: `http://localhost:${PORT}/${row.code}`,
      created_at: row.created_at,
    })),
  );
});

app.delete('/api/links/:code', (req, res) => {
  const code = String(req.params.code);
  const result = db.prepare('DELETE FROM links WHERE code = ?').run(code);

  if (result.changes === 0) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  res.status(200).json({ deleted: true, code });
});

app.get('/:code', (req, res) => {
  const code = String(req.params.code);
  const row = db
    .prepare('SELECT url FROM links WHERE code = ?')
    .get(code) as { url: string } | undefined;

  if (!row) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  res.redirect(302, row.url);
});

app.listen(PORT, () => {
  console.log(`URL shortener listening on http://localhost:${PORT}`);
});

