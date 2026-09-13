import { CreateUserDTO } from '../controllers/dto/CreateUserDTO';
import { LoginDTO } from '../controllers/dto/LoginDTO';
import { UserResponseDTO } from '../controllers/dto/UserResponseDTO';
import { AppError } from '../errors/AppError';
import { UserRepository } from '../repositories/UserRepository';
import { comparePassword, hashPassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  // CADASTRO DE USUÁRIO:
  async register(userData: CreateUserDTO): Promise<UserResponseDTO> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    // 1º verifica se o usuario ja existe no sistema
    if (existingUser) {
      throw new AppError('Usuário já cadastrado com este e-mail', 409);
    }
    //2º: se nao existe, gera uma hash na senhaHash na que ele digitou
    const newHash = await hashPassword(userData.senha);
    // 3º CADASTRA O USUÁRIO com a senhaHash
    const newUser = await this.userRepository.create({
      nome: userData.nome,
      email: userData.email.toLowerCase().trim(),
      senhaHash: newHash,
    });
    // 4º retorna seu cadastro sem mostrar a senhaHash
    return {
      id: newUser.id,
      nome: newUser.nome,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };
  }

  //  TODO LOGIN QUE UM USUÁRIO FIZER SERÁ GERANDO UM TOKEN TEMPORÁRIO PARA QUE ELE UTILIZE O SISTEMA
  // chega os dados cru: { email: "teste@example.com", senha: "123456" }
  async login(dados: LoginDTO): Promise<{ token: string }> {
    const user = await this.userRepository.findByEmail(dados.email);
    // busca no banco pelo e-mail. Se não achou ninguém com esse e-mail, user é `null`.
    if (!user) {
      throw new AppError('Credenciais inválidas', 401);
    }

    // Se achou o e-mail, então pela a senha texto que o usuário digitou e COMPARA com a senhaHash salvo no cadastro dele
    // devolve true ou false — nunca descriptografa o hash, só confere se bate
    const senhaValida = await comparePassword(dados.senha, user.senhaHash);

    if (!senhaValida) {
      // senha errada — MESMA mensagem de erro do caso anterior, de propósito (segurança)
      throw new AppError('Credenciais inválidas', 401);
    }

    // senha correta, gera um Token para ela:
    const token = generateToken({ id: user.id, role: user.role });
    // ex: generateToken({ id: 1, role: "atendente" })
    // devolve algo tipo: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImF0ZW5kZW50ZSJ9.xxxxx"

    return { token };
    // ex: { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...." }
  }
}
