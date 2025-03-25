import { buildApp } from './app';

const start = async () => {
  const app = buildApp();

  const port = Number(process.env.PORT) || 3001;

  try {
    await app.listen({ port, host: '0.0.0.0' }); // Docker対応で host も指定！
    console.log(`🚀 サーバー動いたでしゅ！ → http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1); // 起動に失敗したら安全に止めるでしゅ！
  }
};

start(); // 起動！
