//Interface simples: formato seguro de resposta do usuário(sem decorators, sem validação — são dados que nós mesmos geramos)
import { UserRoleEnum } from '../../entities/User';

export interface UserResponseDTO {
  id: number;
  nome: string;
  email: string;
  role: UserRoleEnum;
  createdAt: Date;
}
