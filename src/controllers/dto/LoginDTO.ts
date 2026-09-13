//Para que serve: mesma razão de sempre: sem validação, dado cru chegaria direto no Service.
import { IsEmail, IsString } from 'class-validator';

// antes de confiar no que chegou em POST /auth/login, precisa garantir que tem o formato certo (e-mail válido, senha como texto).
// ex: { "email": "teste@example.com", "senha": "123456" }
export class LoginDTO {
  @IsEmail() // Define e valida formato do corpo de /auth/login
  email!: string;

  @IsString() // só convere se é texto - não valida tamanho
  senha!: string;
}
