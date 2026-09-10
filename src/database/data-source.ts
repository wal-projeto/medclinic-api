// ARQUIVO QUE CONECTA NO BANCO E REGISTRA ENTIDADES/MIGRATIONS (não cria tabela sozinho)

import 'dotenv/config';
import { DataSource } from 'typeorm';

import { User } from '../entities/User';

//CONFIGURAÇÃO DA FERRAMENTA DataSource DO TYPEORM
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: false,
  entities: [User],
  migrations: ['src/database/migrations/*.ts'],
});

export async function initDatabaseConnection() {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();
}
