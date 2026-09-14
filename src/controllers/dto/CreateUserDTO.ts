// DTO existe pra nunca expor a Entity direto pro cliente. Isso permite mudar a estrutura do banco sem quebrar quem consome sua API, e vice-versa.
import { IsEmail, IsString } from 'class-validator';

// ! = quem preenche essa classe não é um constructor nosso, é a biblioteca (class-transformer), então o TypeScript não tem como provar que o valor sempre existe.
export class CreateUserDTO {
  @IsString() //o Decorator é só uma uma etiqueta/A REGLA que diz que a variável TEM que ser string, ela não valida nada sozinha.
  nome!: string; // A validação real é feita pelo validateOrReject, que lê os decorators e valida o objeto.

  @IsString()
  senha!: string;

  @IsEmail()
  email!: string;
}
