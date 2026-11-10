import crypto from 'node:crypto';
import express from 'express';
import { db } from './prisma/db.ts';

const PORT = 3000;
const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function generateCode(length = 6): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += ALPHABET.charAt(crypto.randomInt(ALPHABET.length));
  }
  return code;
}

const app = express();
app.use(express.json());

app.post('/api/shorten', async (req, res) => {
  const url = typeof req.body?.url === 'string' ? req.body.url.trim() : '';
  if (!url) {
    res.status(400).json({ error: 'url is required' });
    return;
  }

  const code = generateCode();
  await db.orm.public.Link.create({ code, url, createdAt: new Date() });

  res.status(200).json({
    code,
    short: `http://localhost:${PORT}/${code}`,
  });
});

app.get('/api/links', async (_req, res) => {
  const links = await db.orm.public.Link.all();

  res.json(
    links.map((link) => ({
      code: link.code,
      url: link.url,
      short: `http://localhost:${PORT}/${link.code}`,
      created_at: link.createdAt,
    })),
  );
});

app.delete('/api/links/:code', async (req, res) => {
  const code = String(req.params.code);

  // delete() returns the deleted row or null (acts on first() semantics)
  const deleted = await db.orm.public.Link.where({ code }).delete();

  if (!deleted) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  res.status(200).json({ deleted: true, code });
});

app.get('/:code', async (req, res) => {
  const code = String(req.params.code);

  const link = await db.orm.public.Link.first({ code });

  if (!link) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  res.redirect(302, link.url);
});

app.listen(PORT, () => {
  console.log(`URL shortener listening on http://localhost:${PORT}`);
});

