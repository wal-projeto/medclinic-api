import { Router } from 'express';

import { UserController } from '../controllers/UserController';
import { authenticate } from '../middlewares/auth.middleware';

export const userRouter = Router();

export function userRouterBootstrap(userController: UserController) {
  userRouter.get('/me', authenticate, userController.me.bind(userController));
  // quando chegar GET em /users/me:
  // 1º roda authenticate (confere o token, preenche req.user)
  // 2º só se passar, roda userController.me
}
