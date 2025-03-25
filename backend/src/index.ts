import { buildApp } from "./app";

const start = async () => {
  const app = buildApp();
  try {
    await app.listen({
      port: Number(process.env.PORT) || 3001,
      host: "0.0.0.0",
    });
    console.log("🚀 Fastify server started");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
