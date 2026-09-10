import 'reflect-metadata';
import express from 'express';

//import { apiRouter } from './routes/api';
import { initDatabaseConnection } from './database/data-source';

async function main() {
  const app = express();

  await initDatabaseConnection();

  const PORT = Number(process.env.PORT ?? 3000);

  //app.use(express.json({ limit: '50mb' }));
  //app.use('/api', apiRouter);

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT.toString()}`);
  });
}

main().catch(console.error);
