// Middleware de autenticação  RF08 : ler o cabeçalho Authorization, extrair o token, verificar a
// uma função (req, res, next) do Express que confere se um
// token JWT válido veio na requisição, antes de deixar ela continuar pro Controller.

//protege rotas que só fazem sentido pra quem já está logado, como a  (ex: GET /users/me )

import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { UserRoleEnum } from '../entities/User';
import { AppError } from '../errors/AppError';
import { TokenPayload } from '../utils/jwt'; // importando a interface que sera utilizada na funcao jwt.verify(token, secret)

// "Carimba" um campo novo no formulário do Request do Express — a partir daqui,
// todo req do projeto pode opcionalmente ter um req.user
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- necessário para estender o Request do Express
  namespace Express {
    interface Request {
      user?: {
        id: number; // ex: 1
        role: UserRoleEnum; // ex: "atendente"
      };
    }
  }
}
// AUTENTICAÇÃO DE TOKEN: ler o cabeçalho Authorization, extrair o token, verificar a assinatura (jwt.verify), anexar os dados decodificados em req.user, e só então chamar next() (ou lançar erro 401).
export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;
  // 1º Ler o cabeçalho Authorization
  // ex: authHeader = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...."

  if (!authHeader) {
    // ninguém mandou nem tentou mandar um token
    throw new AppError('Token não fornecido', 401);
  }

  const [, token] = authHeader.split(' ');
  // 2º Separa o token
  // "Bearer eyJhbG..." vira ["Bearer", "eyJhbG..."] — pegamos só a 2ª parte

  if (!token) {
    // mandou o cabeçalho, mas sem o formato "Bearer <token>" certo
    throw new AppError('Token mal formatado', 401);
  }

  const secret = process.env.JWT_SECRET;
  // 3º Extrai a chave secreta do JWT
  if (!secret) {
    throw new Error('JWT_SECRET não configurado');
  }

  try {
    //roda jwt.verify(token, secret) - verifica: se a assinatura bater e não estiver expirado, decoded vira:
    // ex: { id: 1, role: "atendente", iat: ..., exp: ... }
    const decoded = jwt.verify(token, secret) as TokenPayload; // TokenPayload importada de jwt.ts
    // se a assinatura NÃO bater (token forjado) ou estiver expirado,
    // jwt.verify lança exceção e cai no catch - o middleware para aqui

    req.user = { id: decoded.id, role: decoded.role };
    // agora req carrega quem é o dono desse token, pro Controller seguinte usar

    next();
    // libera a passagem — o Controller da rota roda em seguida
  } catch {
    throw new AppError('Token inválido ou expirado', 401);
  }
}
