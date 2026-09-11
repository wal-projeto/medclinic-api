import { AppDataSource } from '../database/data-source';
import { User } from '../entities/User';

// Entregando o User ao repositório AppDataSource.getRepository(do TypeORM). Ferramenta que sabe conversar com a tabela users
const ormRepository = AppDataSource.getRepository(User);

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return await ormRepository.findOneBy({ email: email.toLowerCase().trim() }); // LInha de defesa para cadastros duplicados.
  }

  async findById(id: number): Promise<User | null> {
    return await ormRepository.findOneBy({ id });
  }

  //UserData: monta o objeto em memória, para nao ter que exigir "id", "createdAt" e "role"(o banco quem gera)
  async create(userData: {
    nome: string;
    email: string;
    senhaHash: string;
  }): Promise<User> {
    const user = ormRepository.create(userData);
    return await ormRepository.save(user);
  }
}
