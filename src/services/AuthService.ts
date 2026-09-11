import { CreateUserDTO } from '../controllers/dto/CreateUserDTO';
import { UserResponseDTO } from '../controllers/dto/UserResponseDTO';
import { AppError } from '../errors/AppError';
import { UserRepository } from '../repositories/UserRepository';
import { hashPassword } from '../utils/hash';

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(userData: CreateUserDTO): Promise<UserResponseDTO> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError('Usuário já cadastrado com este e-mail', 409);
    }
    const newHash = await hashPassword(userData.senha);

    const newUser = await this.userRepository.create({
      nome: userData.nome,
      email: userData.email.toLowerCase().trim(),
      senhaHash: newHash,
    });
    return {
      id: newUser.id,
      nome: newUser.nome,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };
  }
}
