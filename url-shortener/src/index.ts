import express from 'express';
import { urlRoutes } from './routes/url.routes.ts';
import { env } from './config/env.config.ts';

const PORT = env.PORT ?? 3000;

const app = express();
app.use(express.json());
app.use('/api/url', urlRoutes);

app.listen(PORT, () => {
  console.log(`URL shortener listening on ${process.env.BASE_URL}`);
});

