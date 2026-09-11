import { UserRoleEnum } from '../../entities/User';

export interface UserResponseDTO {
  id: number;
  nome: string;
  email: string;
  role: UserRoleEnum;
  createdAt: Date;
}
