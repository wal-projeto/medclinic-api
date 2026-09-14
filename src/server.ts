// porta de entrada da aplicação, primeiro conectamos o banco, criamos as tabelas, as rotas e depois escutamos as requisições HTTP na porta 3000.
import 'reflect-metadata';
import express from 'express';

import { AdminController } from './controllers/AdminController';
import { AuthController } from './controllers/AuthController';
import { UserController } from './controllers/UserController';
import { initDatabaseConnection } from './database/data-source';
import { errorHandler } from './middlewares/error-handler.middleware';
import { UserRepository } from './repositories/UserRepository';
import { adminRouter, adminRouterBootstrap } from './routes/admin.routes';
import { authRouter, authRouterBootstrap } from './routes/auth.routes';
import { userRouter, userRouterBootstrap } from './routes/user.routes';
import { AuthService } from './services/AuthService';
import { UserService } from './services/UserService';

async function main() {
  const app = express();

  // Conecta o servidor Node.js ao banco de dados PostgreSQL e roda as migrations (criação de tabelas) caso seja a primeira vez que o servidor é iniciado.
  await initDatabaseConnection();

  const userRepository = new UserRepository();
  const authService = new AuthService(userRepository);
  const authController = new AuthController(authService);
  authRouterBootstrap(authController); // registra as rotas /register  e /login dentro do authRouter
  const userService = new UserService(userRepository); // reaproveita o MESMO userRepository já criado pro AuthService
  const userController = new UserController(userService);
  userRouterBootstrap(userController); // registra a rota /me dentro do userRouter
  const adminController = new AdminController();
  adminRouterBootstrap(adminController);
  app.use(express.json({ limit: '50mb' })); // sem ele o req.body chegaria undefined.
  app.use('/auth', authRouter); // auth é o prefixo das rotas /register e /login
  app.use('/users', userRouter); //user é o prefico para a rota /me
  app.use('/admin', adminRouter);

  app.use(errorHandler); // registra o middleware de tratamento de erros
  const PORT = Number(process.env.PORT ?? 3000);

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT.toString()}`);
  });
}

main().catch(console.error);
