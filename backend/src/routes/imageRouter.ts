import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { extractImagesFromUrl } from '../services/imageScraper';

interface ImageScrapeBody {
  url: string;
}

export default async function imageRouter(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.post<{
    Body: ImageScrapeBody;
  }>('/scrape', {
    schema: {
      body: {
        type: 'object',
        required: ['url'],
        properties: {
          url: { type: 'string', format: 'uri' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            images: {
              type: 'array',
              items: { type: 'string', format: 'uri' }
            }
          }
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        500: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, async (request: FastifyRequest<{ Body: ImageScrapeBody }>, reply: FastifyReply) => {
    const { url } = request.body;
    request.log.info(`📥 /image/scrape にPOSTされたURL: ${url}`);

    try {
      const images = await extractImagesFromUrl(url);
      reply.send({ images });
    } catch (error) {
      request.log.error(error, '画像抽出に失敗しました');
      reply.status(500).send({ error: 'Failed to scrape images' });
    }
  });
}
