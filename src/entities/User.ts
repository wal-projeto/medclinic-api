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
