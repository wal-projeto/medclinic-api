// porta de entrada da aplicação, primeiro conectamos o banco, criamos as tabelas, as rotas e depois escutamos as requisições HTTP na porta 3000.
import 'reflect-metadata';
import express from 'express';

import { AuthController } from './controllers/AuthController';
import { initDatabaseConnection } from './database/data-source';
import { UserRepository } from './repositories/UserRepository';
import { authRouter, authRouterBootstrap } from './routes/auth.routes';
import { AuthService } from './services/AuthService';

async function main() {
  const app = express();

  // Conecta o servidor Node.js ao banco de dados PostgreSQL e roda as migrations (criação de tabelas) caso seja a primeira vez que o servidor é iniciado.
  await initDatabaseConnection();

  const userRepository = new UserRepository();
  const authService = new AuthService(userRepository);
  const authController = new AuthController(authService);
  authRouterBootstrap(authController); // registra a rota authController dentro do authRouter = Router()

  app.use(express.json({ limit: '50mb' })); // sem ele o req.body chegaria undefined.
  app.use('/auth', authRouter); // auth é o prefixo da rota, então a rota completa para registrar um usuário será /auth/register.

  const PORT = Number(process.env.PORT ?? 3000);

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT.toString()}`);
  });
}

main().catch(console.error);
