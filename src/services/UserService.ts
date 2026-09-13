import { UserResponseDTO } from '../controllers/dto/UserResponseDTO';
import { AppError } from '../errors/AppError';
import { UserRepository } from '../repositories/UserRepository';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: number): Promise<UserResponseDTO> {
    // id chega aqui, ex: 1 (veio do req.user.id, decodificado do token)

    const user = await this.userRepository.findById(id);
    // busca no banco pelo id. Se achou, user vira algo tipo:
    // { id: 1, nome: "Teste da Silva", email: "teste@example.com", senhaHash: "$2b$10$abc...", role: "atendente", createdAt: ... }
    // Se não achou (ex: usuário foi deletado depois do token ser emitido), user é `null`.

    if (!user) {
      // caso raro, mas possível: token ainda válido, mas o usuário não existe mais no banco
      throw new AppError('Usuário não encontrado', 404);
    }

    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
    // ex: { id: 1, nome: "Teste da Silva", email: "teste@example.com", role: "atendente", createdAt: "2026-..." }
    // repara: SEM senhaHash — mesmo cuidado que tomamos no register()
  }
}
