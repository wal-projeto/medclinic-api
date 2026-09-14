// ponte de comunicação oficial entre a aplicação Node.js e o servidor do PostgreSQL (não cria tabela sozinho)
import 'dotenv/config';
import { DataSource } from 'typeorm';

import { User } from '../entities/User';

//Instanciando DataSource(do TypeORM) com propriedades process.env. para proteger os dados.
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
//Exporta essa configuração para ser ligada na inicialização do servidor, no server.ts.
export async function initDatabaseConnection() {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();
}
