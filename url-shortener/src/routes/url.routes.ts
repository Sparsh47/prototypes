import { Router } from "express";
import { db } from "../prisma/db.ts";
import { generateCode } from "../utils/url.utils.ts";
import { env } from "../config/env.config.ts";

export const urlRoutes = Router();

urlRoutes.post('/shorten', async (req, res) => {
    const url = typeof req.body?.url === 'string' ? req.body.url.trim() : '';
    if (!url) {
        res.status(400).json({ error: 'url is required' });
        return;
    }

    const code = generateCode();
    await db.orm.public.Link.create({ code, url, createdAt: new Date() });

    res.status(201).json({
        code,
        short: `${env.BASE_URL}/api/${code}`,
    });
});

urlRoutes.get('/links', async (_req, res) => {
    const links = await db.orm.public.Link.all();

    res.json(
        links.map((link) => ({
            code: link.code,
            url: link.url,
            short: `${env.BASE_URL}/api/${link.code}`,
            created_at: link.createdAt,
        })),
    );
});

urlRoutes.delete('/links/:code', async (req, res) => {
    const code = String(req.params.code);

    const deleted = await db.orm.public.Link.where({ code }).delete();

    if (!deleted) {
        res.status(404).json({ error: 'Not found' });
        return;
    }

    res.status(200).json({ deleted: true, code });
});

urlRoutes.get('/:code', async (req, res) => {
    const code = String(req.params.code);

    const link = await db.orm.public.Link.first({ code });

    if (!link) {
        res.status(404).json({ error: 'Not found' });
        return;
    }

    res.redirect(302, link.url);
});