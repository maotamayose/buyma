import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';

import productRouter from './routes/productRouter';
import imageRouter from './routes/imageRouter';

dotenv.config();

export function buildApp() {
  const fastify = Fastify({ logger: true });

  // CORS
  fastify.register(cors, {
    origin: '*', // 本番では適切に制限をかける
  });

  // ルート登録
  fastify.register(productRouter, { prefix: '/product' });
  fastify.register(imageRouter, { prefix: '/image' });

  return fastify;
}
