// So chega aqui se o token for válido(AUTENTICAÇÃO ) ->
// recebe a lista de roles permitidos e devolve a função (req, res, next) de verdade,
//  que compara req.user.role com essa lista.
import type { NextFunction, Request, Response } from 'express';

import { UserRoleEnum } from '../entities/User';
import { AppError } from '../errors/AppError';

// Confere se o role de usuário autenticado está entre os permitidos para essa rota
// AUTORIZAÇÃO (RF09 - so em rotas admin)
export function authorize(...allowedRoles: UserRoleEnum[]) {
  // ...allowedRoles: rest parameter -a função aceita os parametros que eu determinar, no caso só 1: allowedRoles ['admin']
  return function (req: Request, res: Response, next: NextFunction): void {
    if (!req.user) {
      throw new AppError('Não autenticado', 401);
    }
    // allowedRoles = ['admin']
    if (!allowedRoles.includes(req.user.role)) {
      // req.user.role = "atendente" → não está em ['admin'] → 403
      throw new AppError('Acesso negado', 403);
    }
    // req.user.role = "admin" → está em ['admin'] → passa
    next();
  };
}
