import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum UserRoleEnum {
  ADMIN = 'admin',
  ATENDENTE = 'atendente',
}

// Classe TypeScript que lista os atributos com seus decoradores do TypeORM,
// e que serão mapeados para a tabela users do banco de dados PostgreSQL.
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 250 })
  nome!: string;

  @Column({ unique: true, type: 'varchar', length: 100 })
  email!: string;

  @Column({ type: 'varchar', length: 100 })
  senhaHash!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'varchar', length: 100, default: UserRoleEnum.ATENDENTE })
  role!: UserRoleEnum;
}
