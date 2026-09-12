import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import type { Request, Response } from 'express';

import { AuthService } from '../services/AuthService';
import { CreateUserDTO } from './dto/CreateUserDTO';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async register(req: Request, res: Response): Promise<void> {
    const body: unknown = req.body; //unknown diz eu não sei ainda o formato do bady, mas prometo provar antes de usar
    const dto = plainToClass(CreateUserDTO, body); // ok, CreateUserDTO é o molde que eu preciso usar pra construir o objeto — e é dele que eu vou ler os decorators @IsString, @IsEmail
    await validateOrReject(dto);
    const result = await this.authService.register(dto);
    res.status(201).json(result);
  }
}
/** MENSAGEM DE EXEMPLO DE RETORNO DO register()
 *  201 Created
 * {
  "id": 3,
  "nome": "José Silva",
  "email": "jose@gmail.com",
  "role": "atendente",
  "createdAt": "2026-09-11T14:32:00.000Z"
}
 Não tem senhaHash, pois o AuthService montou o objeto de retorno só com os campos seguros*/
