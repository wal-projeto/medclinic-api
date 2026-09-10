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

  @Column()
  nome!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  senhaHash!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ default: UserRoleEnum.ATENDENTE })
  role!: UserRoleEnum;
}
