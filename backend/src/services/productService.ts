import { FastifyRequest, FastifyReply } from 'fastify';
import { searchOfficialSite, searchProductInOfficialSite } from '../external/googleSearch';

export async function handleProductSearch(request: FastifyRequest<{
  Querystring: { brand: string; keyword: string };
}>, reply: FastifyReply) {
  const { brand, keyword } = request.query;

  try {
    const brandUrl = await searchOfficialSite(brand);
    if (!brandUrl) {
      return reply.status(404).send({ error: 'Official site not found' });
    }

    const results = await searchProductInOfficialSite(brandUrl, keyword);

    return reply.send({
      brand,
      keyword,
      officialSite: brandUrl,
      results,
    });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ error: 'Search failed' });
  }
}
