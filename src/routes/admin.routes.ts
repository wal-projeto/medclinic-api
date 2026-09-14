import { Router } from 'express';

import { AdminController } from '../controllers/AdminController';
import { UserRoleEnum } from '../entities/User';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/rbac.middleware';

export const adminRouter = Router();

export function adminRouterBootstrap(adminController: AdminController): void {
  adminRouter.get(
    '/ping',
    authenticate,
    authorize(UserRoleEnum.ADMIN),
    adminController.ping.bind(adminController),
  );
}
