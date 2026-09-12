import { Router } from 'express';

import { AuthController } from '../controllers/AuthController';
export const authRouter = Router();

export function authRouterBootstrap(authController: AuthController) {
  authRouter.post('/register', authController.register.bind(authController));
}
