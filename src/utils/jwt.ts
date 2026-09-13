import jwt from 'jsonwebtoken'; // biblioteca que sabe criar e assinar tokens JWT

import { UserRoleEnum } from '../entities/User';

// Formato dos dados que vão DENTRO do token
export interface TokenPayload {
  id: number; // 1
  role: UserRoleEnum; // atentende ou admin
}
// Recebe os dados do payload (ex: { id: 1, role: "atendente" })
export function generateToken(payload: TokenPayload): string {
  const secret = process.env.JWT_SECRET; // lê a chave secreta
  // se esqueceu de configurar o .env o JWT_SECRET, quebra aqui
  if (!secret) {
    throw new Error('JWT não configurado');
  }
  // jwt.sign(dado, chave, opções) -> devolve o token, uma string llonga,
  // com 3 partes separadas por ponto: cabeçalho.payload.assinatura
  return jwt.sign(payload, secret, { expiresIn: '1h' });
}

/**
Aplicação prática: AuthService.login(email, senha) → busca usuário → compara senha → 
se ok, ***chama jwt.sign(payload, SEGREDO, { expiresIn }) <-onde estamos para criar o token *** → devolve { token }.
 */
