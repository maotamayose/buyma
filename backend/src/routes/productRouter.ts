import { FastifyInstance } from "fastify";
import { handleProductSearch } from "../services/productService";

export default async function productRouter(fastify: FastifyInstance) {
  fastify.get<{
    Querystring: { brand: string; keyword: string };
  }>(
    "/",
    {
      schema: {
        querystring: {
          type: "object",
          required: ["brand", "keyword"],
          properties: {
            brand: { type: "string" },
            keyword: { type: "string" },
          },
        },
      },
    },
    handleProductSearch
  ); 
}
