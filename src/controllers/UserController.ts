import type { Request, Response } from 'express';

import { AppError } from '../errors/AppError';
import { UserService } from '../services/UserService';

export class UserController {
  constructor(private readonly userService: UserService) {}

  async me(req: Request, res: Response): Promise<void> {
    // req.user foi preenchido pelo middleware authenticate (RF08), ANTES desse método "me" rodar
    if (!req.user) {
      // defesa extra: mesmo o authenticate garantindo isso hoje, nunca é errado checar de verdade em vez de prometer com "!" com um codigo assim:  const userId = req.user!.id
      throw new AppError('Não autenticado', 401);
    }
    const userId = req.user.id;
    // userId autenticado pelo middleware autenticate (RF08)

    const result = await this.userService.findById(userId);
    // Controller passa para o Service o id para busca, ex: 1
    // ex: result = { id: 1, nome: "Teste da Silva", email: "teste@example.com", role: "atendente", createdAt: "..." }

    res.status(200).json(result);
    // 200 (não 201) — essa rota só CONSULTA, não cria nada novo
  }
}
