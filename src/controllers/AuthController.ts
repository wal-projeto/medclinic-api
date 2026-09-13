import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import type { Request, Response } from 'express';

import { AuthService } from '../services/AuthService';
import { CreateUserDTO } from './dto/CreateUserDTO';
import { LoginDTO } from './dto/LoginDTO';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // CADASTRO DE USUÁRIO:
  async register(req: Request, res: Response): Promise<void> {
    const body: unknown = req.body;
    //unknown diz eu não sei ainda o formato do bady, mas prometo provar antes de usar
    const dto = plainToClass(CreateUserDTO, body);
    // ok, CreateUserDTO é o molde que eu preciso usar pra construir o objeto — e é dele que eu vou ler os decorators @IsString, @IsEmail
    await validateOrReject(dto);
    // valida os dados
    const result = await this.authService.register(dto);
    //ENVIA OS DADOS PARA O SERVICE FAZER O CADASTRO, SE OK RETORNA 201 Criado
    res.status(201).json(result);
  }

  /** MENSAGEM DE RETORNO NA TELA - OBS: Não tem senhaHash, só com os campos seguros:
  
  201 Created
  {
    "id": 3,
    "nome": "José Silva",
    "email": "jose@gmail.com",
    "role": "atendente",
    "createdAt": "2026-09-11T14:32:00.000Z"
  }
  */

  // LOGIN DE USUÁRIO: pegar req.body cru, valida com plainToclass e validateReject, chamar o Service para fazer o login, se ok responder status 200
  async login(req: Request, res: Response): Promise<void> {
    const body: unknown = req.body;
    // ex: req.body chega como { email: "teste@example.com", senha: "123456" } (JSON cru do cliente)

    const dto = plainToClass(LoginDTO, body);
    // transforma o objeto cru numa instância de LoginDTO (agora os decorators valem de verdade)

    await validateOrReject(dto);
    // roda @IsEmail/@IsString de verdade — se e-mail for inválido, lança erro aqui, antes de chegar no Service

    const result = await this.authService.login(dto);
    // ENVIANDO OS DADOS PARA O SERVICE FAZER O LOGIN DO USUÁRIO, SE OK RETORNA O TOKEN DELE
    // ex: result = { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...." }

    res.status(200).json(result);
    // manda pro cliente: status 200 (OK — login não "cria" nada, por isso não é 201)
    // corpo: {"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...."}
  }
}
