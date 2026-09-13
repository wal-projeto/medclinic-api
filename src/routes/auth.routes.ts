import { Router } from 'express';

import { AuthController } from '../controllers/AuthController';

// O Router liga as entradas HTTP( /register ou /login) nas suas respectivas funções dentro do sistema
export const authRouter = Router();

export function authRouterBootstrap(authController: AuthController) {
  authRouter.post('/register', authController.register.bind(authController));

  authRouter.post('/login', authController.login.bind(authController));
  //quando chegar POST em /auth/login, chama authController.login
}
