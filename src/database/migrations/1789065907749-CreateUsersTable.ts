// Cria/altera a estrutura física da tabela no banco; roda uma vez (ou quando há mudança), nunca a cada requisição
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1789065907749 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                "senhaHash" VARCHAR(255) NOT NULL, -- o Postgres deixa tudo em minúsculo automaticamente, por isso o uso das aspas duplas
                role VARCHAR(20) NOT NULL DEFAULT 'atendente',
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
              
            );
        `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
